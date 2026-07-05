<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Services\OrderService;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    protected $orderService;

    public function __construct(OrderService $orderService)
    {
        $this->orderService = $orderService;
    }

    public function index(Request $request)
    {
        $page = $request->input('page', 1);
        $limit = $request->input('limit', 12);

        $total = Order::count();
        $orders = Order::with('orderItems')
            ->orderBy('created_at', 'desc')
            ->skip(($page - 1) * $limit)
            ->take($limit)
            ->get();

        return response()->json([
            'data' => $orders,
            'pagination' => [
                'page' => (int) $page,
                'limit' => (int) $limit,
                'total_items' => $total,
                'total_pages' => ceil($total / $limit),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'required|email|max:255',
            'customer_phone' => 'nullable|string|max:50',
            'shipping_address' => 'required|string',
            'shipping_city' => 'nullable|string|max:100',
            'shipping_postal_code' => 'nullable|string|max:20',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|integer|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        $customerData = [
            'customer_name' => $validated['customer_name'],
            'customer_email' => $validated['customer_email'],
            'customer_phone' => $validated['customer_phone'] ?? null,
            'shipping_address' => $validated['shipping_address'],
            'shipping_city' => $validated['shipping_city'] ?? null,
            'shipping_postal_code' => $validated['shipping_postal_code'] ?? null,
        ];

        $idempotencyKey = $request->header('Idempotency-Key');

        try {
            $result = $this->orderService->checkout(
                $customerData,
                $validated['items'],
                $idempotencyKey
            );

            return response()->json([
                'id' => $result['order']->id,
                'order_number' => $result['order']->order_number,
                'total' => $result['order']->total,
                'items' => $result['order']->orderItems,
            ], $result['status']);

        } catch (\Exception $e) {
            $statusCode = $e->getCode();

            // Default to 500 if code is not a valid HTTP status
            if ($statusCode < 400 || $statusCode >= 600) {
                $statusCode = 500;
            }

            return response()->json([
                'error' => $e->getMessage(),
            ], $statusCode);
        }
    }

    public function show(Order $order)
    {
        return response()->json($order->load('orderItems'));
    }
}

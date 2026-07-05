<?php

namespace App\Services;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Support\Facades\DB;

class OrderService
{
    public function checkout(array $customerData, array $items, ?string $idempotencyKey = null)
    {
        // Check idempotency key to prevent duplicate orders
        if ($idempotencyKey) {
            $existingOrder = Order::where('idempotency_key', $idempotencyKey)->first();
            if ($existingOrder) {
                return [
                    'order' => $existingOrder->load('orderItems'),
                    'status' => 200, // Already processed
                ];
            }
        }

        // Sort items by product_id to prevent deadlocks
        usort($items, fn($a, $b) => $a['product_id'] <=> $b['product_id']);

        return DB::transaction(function () use ($customerData, $items, $idempotencyKey) {
            $orderItems = [];
            $total = 0;

            // Lock products and verify stock
            foreach ($items as $item) {
                $product = Product::where('id', $item['product_id'])
                    ->lockForUpdate()
                    ->first();

                if (!$product) {
                    throw new \Exception("Product with ID {$item['product_id']} not found", 404);
                }

                if ($product->stock < $item['quantity']) {
                    throw new \Exception("Insufficient stock for product: {$product->name}. Available: {$product->stock}, Requested: {$item['quantity']}", 409);
                }

                // Prepare order item data with snapshot
                $subtotal = $product->price * $item['quantity'];
                $orderItems[] = [
                    'product_id' => $product->id,
                    'product_name' => $product->name, // Snapshot
                    'unit_price' => $product->price, // Snapshot
                    'quantity' => $item['quantity'],
                    'subtotal' => $subtotal,
                ];

                $total += $subtotal;

                // Decrement stock
                $product->decrement('stock', $item['quantity']);
            }

            // Create order
            $order = Order::create([
                'order_number' => '', // Will be set after creation
                'customer_name' => $customerData['customer_name'],
                'customer_email' => $customerData['customer_email'],
                'customer_phone' => $customerData['customer_phone'] ?? null,
                'shipping_address' => $customerData['shipping_address'],
                'shipping_city' => $customerData['shipping_city'] ?? null,
                'shipping_postal_code' => $customerData['shipping_postal_code'] ?? null,
                'total' => $total,
                'status' => 'completed',
                'idempotency_key' => $idempotencyKey,
            ]);

            // Generate order number based on ID
            $order->update(['order_number' => 'ORD-' . $order->id]);

            // Create order items
            foreach ($orderItems as $itemData) {
                $order->orderItems()->create($itemData);
            }

            return [
                'order' => $order->load('orderItems'),
                'status' => 201, // Created
            ];
        });
    }
}

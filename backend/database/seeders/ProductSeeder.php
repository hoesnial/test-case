<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            // Electronics
            [
                'category_id' => 1,
                'name' => 'Wireless Headphones Pro',
                'description' => 'Premium over-ear wireless headphones with active noise cancellation and 30-hour battery life.',
                'price' => 89.99,
                'image_url' => 'https://placehold.co/400x400/1e3a8a/white?text=Headphones',
                'stock' => 15,
            ],
            [
                'category_id' => 1,
                'name' => 'Smart Watch Ultra',
                'description' => 'Advanced smartwatch with fitness tracking, heart rate monitor, and GPS navigation.',
                'price' => 299.99,
                'image_url' => 'https://placehold.co/400x400/1e3a8a/white?text=Smart+Watch',
                'stock' => 8,
            ],
            [
                'category_id' => 1,
                'name' => 'Bluetooth Speaker',
                'description' => 'Portable waterproof speaker with 360-degree sound and 12-hour playtime.',
                'price' => 49.99,
                'image_url' => 'https://placehold.co/400x400/1e3a8a/white?text=Speaker',
                'stock' => 25,
            ],

            // Clothing
            [
                'category_id' => 2,
                'name' => 'Classic Cotton T-Shirt',
                'description' => 'Comfortable 100% organic cotton t-shirt in classic fit. Available in multiple colors.',
                'price' => 19.99,
                'image_url' => 'https://placehold.co/400x400/059669/white?text=T-Shirt',
                'stock' => 50,
            ],
            [
                'category_id' => 2,
                'name' => 'Denim Jeans',
                'description' => 'Premium stretch denim jeans with modern slim fit and reinforced stitching.',
                'price' => 59.99,
                'image_url' => 'https://placehold.co/400x400/059669/white?text=Jeans',
                'stock' => 2, // Low stock for testing
            ],
            [
                'category_id' => 2,
                'name' => 'Leather Jacket',
                'description' => 'Genuine leather jacket with quilted lining and multiple pockets.',
                'price' => 149.99,
                'image_url' => 'https://placehold.co/400x400/059669/white?text=Jacket',
                'stock' => 10,
            ],

            // Home & Living
            [
                'category_id' => 3,
                'name' => 'Ceramic Coffee Mug',
                'description' => 'Handcrafted ceramic mug with ergonomic handle. Microwave and dishwasher safe.',
                'price' => 12.99,
                'image_url' => 'https://placehold.co/400x400/dc2626/white?text=Mug',
                'stock' => 100,
            ],
            [
                'category_id' => 3,
                'name' => 'Throw Pillow Set',
                'description' => 'Set of 2 decorative throw pillows with removable covers. Machine washable.',
                'price' => 34.99,
                'image_url' => 'https://placehold.co/400x400/dc2626/white?text=Pillows',
                'stock' => 30,
            ],
            [
                'category_id' => 3,
                'name' => 'Wall Clock Modern',
                'description' => 'Minimalist wall clock with silent movement and clear numbered display.',
                'price' => 45.99,
                'image_url' => 'https://placehold.co/400x400/dc2626/white?text=Clock',
                'stock' => 20,
            ],

            // Sports
            [
                'category_id' => 4,
                'name' => 'Yoga Mat Premium',
                'description' => 'Extra thick non-slip yoga mat with carrying strap. Eco-friendly TPE material.',
                'price' => 29.99,
                'image_url' => 'https://placehold.co/400x400/f59e0b/white?text=Yoga+Mat',
                'stock' => 40,
            ],
            [
                'category_id' => 4,
                'name' => 'Running Shoes',
                'description' => 'Lightweight running shoes with responsive cushioning and breathable mesh upper.',
                'price' => 79.99,
                'image_url' => 'https://placehold.co/400x400/f59e0b/white?text=Shoes',
                'stock' => 18,
            ],
            [
                'category_id' => 4,
                'name' => 'Water Bottle Insulated',
                'description' => 'Stainless steel insulated water bottle keeps drinks cold for 24 hours. BPA-free.',
                'price' => 24.99,
                'image_url' => 'https://placehold.co/400x400/f59e0b/white?text=Bottle',
                'stock' => 60,
            ],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}

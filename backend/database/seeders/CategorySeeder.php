<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            // Fashion & Clothing
            ['name' => 'T-Shirt'],
            ['name' => 'Jacket'],
            ['name' => 'Shirt'],
            ['name' => 'Jeans'],
            ['name' => 'Dress'],
            ['name' => 'Skirt'],
            ['name' => 'Sweater'],
            ['name' => 'Coat'],
            ['name' => 'Suit'],
            ['name' => 'Socks'],

            // Footwear
            ['name' => 'Shoes'],
            ['name' => 'Sandals'],
            ['name' => 'Boots'],

            // Accessories
            ['name' => 'Bag'],
            ['name' => 'Watch'],
            ['name' => 'Cap'],
            ['name' => 'Sunglasses'],
            ['name' => 'Belt'],
            ['name' => 'Scarf'],
            ['name' => 'Gloves'],
            ['name' => 'Jewelry'],
            ['name' => 'Wallet'],

            // Electronics
            ['name' => 'Smartphone'],
            ['name' => 'Laptop'],
            ['name' => 'Computer'],
            ['name' => 'Tablet'],
            ['name' => 'Camera'],
            ['name' => 'Headphones'],
            ['name' => 'Speaker'],
            ['name' => 'TV'],
            ['name' => 'Gaming'],
            ['name' => 'Keyboard'],

            // Sports & Fitness
            ['name' => 'Sportswear'],
            ['name' => 'Gym Equipment'],
            ['name' => 'Yoga'],
            ['name' => 'Sports Ball'],
            ['name' => 'Bicycle'],
            ['name' => 'Swimming'],

            // Home & Living
            ['name' => 'Furniture'],
            ['name' => 'Bedroom'],
            ['name' => 'Lighting'],
            ['name' => 'Kitchen'],
            ['name' => 'Tools'],
            ['name' => 'Garden'],
            ['name' => 'Home Decor'],

            // Beauty & Health
            ['name' => 'Beauty'],
            ['name' => 'Makeup'],
            ['name' => 'Skincare'],
            ['name' => 'Perfume'],
            ['name' => 'Hair Care'],

            // Food & Beverage
            ['name' => 'Food'],
            ['name' => 'Beverages'],
            ['name' => 'Snacks'],
            ['name' => 'Coffee'],

            // Books & Education
            ['name' => 'Books'],
            ['name' => 'Stationery'],

            // Kids & Baby
            ['name' => 'Kids Fashion'],
            ['name' => 'Toys'],
            ['name' => 'Baby Products'],

            // Others
            ['name' => 'Pet Supplies'],
            ['name' => 'Automotive'],
            ['name' => 'Travel'],
        ];

        foreach ($categories as $category) {
            Category::firstOrCreate($category);
        }
    }
}

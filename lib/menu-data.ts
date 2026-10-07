export type MenuTab = 'desserts' | 'savory'

export type FeaturedItem = {
  name: string
  description: string
  price: number
  fromPrice?: boolean
  image: string
  tag?: string
}

export type MenuCategory = {
  category: string
  notes?: string
  items: { name: string; price: number }[]
}

const flavors = ['Honey BBQ', 'Parmesani Garlic', 'Korean Chatka', 'AMBES Hot', 'Spicy Lemon']
const flavored = (price: number) => flavors.map((name) => ({ name, price }))

export const featured: Record<MenuTab, FeaturedItem[]> = {
  desserts: [
    {
      name: 'San Sebastian Slice',
      description: 'Burnt Basque cheesecake with chocolate or strawberry sauce.',
      price: 500,
      image: '/images/san-sebastian.png',
      tag: 'Signature',
    },
    {
      name: '3 Milk-TresLeches Tub',
      description: 'Dreamy, Lotus, Caramel or Cookie & Cream soaked sponge.',
      price: 500,
      image: '/images/tres-leches.png',
    },
    {
      name: 'Matilda Fudge',
      description: 'Dense, glossy chocolate fudge cake by the slice.',
      price: 500,
      image: '/images/matilda-fudge.png',
      tag: 'Bestseller',
    },
    {
      name: 'Cinnamon Rolls',
      description: 'Soft swirls, warm spice and cream cheese glaze.',
      price: 500,
      image: '/images/cinnamon-roll.png',
    },
    {
      name: 'NY Choco Cookie',
      description: 'Thick New York cookie with 1 oz chocolate sauce.',
      price: 400,
      image: '/images/choco-cookie.png',
    },
    {
      name: 'NY Trio Cookie',
      description: 'Thick New York trio cookie with 1 oz chocolate sauce.',
      price: 400,
      image: '/images/ny-trio-cookie.jpg',
    },
  ],
  savory: [
    {
      name: 'Korean Chatka Wilder Wings',
      description: 'Six sticky, spicy Korean-glazed wings.',
      price: 800,
      image: '/images/korean-wings.png',
      tag: 'Hot',
    },
    {
      name: 'Honey BBQ Dumplings',
      description: 'Six chicken dumplings in smoky honey BBQ glaze.',
      price: 700,
      image: '/images/bbq-dumplings.png',
    },
    {
      name: 'Fried Chicken',
      description: 'Served with fries, bun and our signature sauce.',
      price: 650,
      fromPrice: true,
      image: '/images/fried-chicken.png',
      tag: 'Bestseller',
    },
    {
      name: "Chicken'N'Noodles",
      description: 'Saucy noodles with crispy chicken, five flavors.',
      price: 750,
      image: '/images/chicken-noodles.png',
    },
  ],
}

export const fullMenu: Record<MenuTab, MenuCategory[]> = {
  savory: [
    {
      category: 'Fried Chicken',
      notes: 'Served with fries, bun & signature sauce',
      items: [
        { name: '2 pcs. Chicken', price: 650 },
        { name: '4 pcs. Chicken', price: 1200 },
        { name: '8 pcs. Chicken', price: 2300 },
      ],
    },
    { category: 'Wilder Wings (6 pcs)', items: flavored(800) },
    { category: "Chicken'N'Fries", items: flavored(750) },
    { category: 'Chicken Dumplings (6 pcs)', items: flavored(700) },
    { category: "Chicken'N'Noodles", items: flavored(750) },
    {
      category: 'More to Go',
      items: [
        { name: 'Pizza Large (incl. 2 oz flavor topping)', price: 1600 },
        { name: 'Chicken Shawarma', price: 700 },
        { name: 'French Fries', price: 450 },
      ],
    },
    {
      category: 'Add-On',
      items: [
        { name: 'Icey Cappuccino', price: 700 },
        { name: 'Bun', price: 100 },
        { name: 'Sauce / Garlic Sauce', price: 100 },
        { name: 'Soft Drinks', price: 200 },
        { name: 'Water', price: 100 },
      ],
    },
  ],
  desserts: [
    {
      category: 'Cake Slices & Bars',
      notes: 'With 1 oz chocolate or strawberry sauce',
      items: [
        { name: 'San Sebastian Slice', price: 500 },
        { name: 'NY Classic Slice', price: 500 },
        { name: 'Matilda Fudge Slice', price: 500 },
      ],
    },
    {
      category: '3 Milk-TresLeches Tub',
      items: [
        { name: 'Dreamy 3MilkCake', price: 500 },
        { name: 'Lotus 3MilkCake', price: 500 },
        { name: 'Caramel 3Milk', price: 500 },
        { name: 'Cookie & Cream 3MilkCake', price: 500 },
      ],
    },
    {
      category: 'Whole Cakes',
      notes: 'With 2 oz chocolate or strawberry sauce',
      items: [
        { name: 'San Sebastian 1 Pound', price: 1750 },
        { name: 'NY Classic 1 Pound', price: 1750 },
        { name: 'Matilda Fudge 500 g', price: 1400 },
        { name: 'Matilda Fudge 950 g', price: 2600 },
        { name: 'Pound TeaCake', price: 650 },
      ],
    },
    {
      category: 'Donuts',
      items: [
        { name: 'Sugary Dipped', price: 350 },
        { name: 'Custard Filled', price: 350 },
        { name: 'Chocolate Dipped', price: 350 },
        { name: 'Lotus Dipped', price: 350 },
      ],
    },
    {
      category: 'Just Desserts',
      items: [
        { name: 'Classic Tiramisu Tub', price: 450 },
        { name: 'NY Trio Cookie (with 1 oz chocolate sauce)', price: 400 },
        { name: 'NY Choco Cookie (with 1 oz chocolate sauce)', price: 400 },
      ],
    },
    {
      category: 'Brownies & Fudges',
      items: [
        { name: 'Mousse Fudgy Brownie', price: 400 },
        { name: 'Peanut Butter Fudgy Brownie', price: 400 },
        { name: 'Fudgy Brownie (with 1 oz chocolate sauce)', price: 400 },
        { name: 'Choco Fudge Ball', price: 250 },
      ],
    },
    {
      category: 'Rolls',
      items: [
        { name: 'Cinnamon Roll', price: 500 },
        { name: 'Cardamom Roll', price: 500 },
      ],
    },
    {
      category: 'Croissants (Pack of 2)',
      items: [
        { name: 'Buttery Croissants', price: 450 },
        { name: 'Chocolate Croissants', price: 450 },
      ],
    },
    {
      category: 'Sundaes',
      items: [
        { name: 'Lotus Sundae', price: 400 },
        { name: 'Chocolate Sundae', price: 400 },
      ],
    },
  ],
}

export const formatPrice = (price: number) => `Rs. ${price.toLocaleString('en-US')}`

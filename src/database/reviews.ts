interface Review {
  id: number;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  text: string;
  product: string;
}

export const reviews: Review[] = [
  {
    id: 1,
    author: "Michael K.",
    avatar: "https://i.pravatar.cc/150?img=11",
    rating: 5,
    date: "July 15, 2023",
    text: "These are the best sunglasses I've ever owned. The wood finish is beautiful and the quality is outstanding. Worth every penny!",
    product: "Canby Wood Sunglasses",
  },
  {
    id: 2,
    author: "Sarah L.",
    avatar: "https://i.pravatar.cc/150?img=5",
    rating: 5,
    date: "August 3, 2023",
    text: "Absolutely love my new shades! They're lightweight, stylish, and I get compliments everywhere I go. The sustainable materials are a huge plus.",
    product: "Pearl Metal Sunglasses",
  },
  {
    id: 3,
    author: "David R.",
    avatar: "https://i.pravatar.cc/150?img=8",
    rating: 5,
    date: "September 12, 2023",
    text: "The craftsmanship is exceptional. These sunglasses are not only beautiful but also incredibly comfortable. Customer service was excellent too!",
    product: "Kennedy Acetate Sunglasses",
  },
];
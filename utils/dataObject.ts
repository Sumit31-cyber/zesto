import { ImageRequireSource } from "react-native";
import {
  ItemAddon,
  RecommendedRestaurantDataTypes,
  Restaurant,
} from "types/types";

export const foodType = [
  {
    id: 0,
    name: "Dosa",
    image: require("assets/dosa.png"),
  },
  {
    id: 1,
    name: "Burger",
    image: require("assets/burger.png"),
  },
  {
    id: 2,
    name: "Cakes",
    image: require("assets/cake.png"),
  },

  {
    id: 4,
    name: "Gulab Jamun",
    image: require("assets/gulabJamun.png"),
  },
  {
    id: 5,
    name: "patatha",
    image: require("assets/paratha.png"),
  },
  {
    id: 6,
    name: "Noodles",
    image: require("assets/noodles.png"),
  },
  {
    id: 7,
    name: "Momos",
    image: require("assets/momos.png"),
  },
  {
    id: 8,
    name: "Chinese",
    image: require("assets/chinese.png"),
  },
  {
    id: 10,
    name: "Rolls",
    image: require("assets/rolls.png"),
  },
  {
    id: 11,
    name: "North Indian",
    image: require("assets/northIndian.png"),
  },
  {
    id: 12,
    name: "Sandwich",
    image: require("assets/snadwich.png"),
  },
  {
    id: 13,
    name: "Chole Bhature",
    image: require("assets/choleBhature.png"),
  },

  {
    id: 14,
    name: "Ice Cream",
    image: require("assets/iceCream.png"),
  },
  {
    id: 15,
    name: "Pasta",
    image: require("assets/pasta.png"),
  },
  {
    id: 16,
    name: "Pure Veg",
    image: require("assets/vegFood.png"),
  },
  {
    id: 17,
    name: "Salad",
    image: require("assets/salad.png"),
  },
  {
    id: 18,
    name: "Idli",
    image: require("assets/idli.png"),
  },
  {
    id: 3,
    name: "Shakes",
    image: require("assets/shakes.png"),
  },
];

export const regularFoodData = [
  {
    id: 1,
    name: "biryani",
    imageUrl:
      "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_288,h_360/MERCHANDISING_BANNERS/IMAGES/MERCH/2024/7/2/6ef07bda-b707-48ea-9b14-2594071593d1_Biryani.png",
  },
  {
    id: 2,
    name: "burgers",
    imageUrl:
      "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_288,h_360/MERCHANDISING_BANNERS/IMAGES/MERCH/2024/7/2/8f508de7-e0ac-4ba8-b54d-def9db98959e_burger.png",
  },
  {
    id: 3,
    name: "north indian",
    imageUrl:
      "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_288,h_360/MERCHANDISING_BANNERS/IMAGES/MERCH/2024/7/2/6ef07bda-b707-48ea-9b14-2594071593d1_North%20Indian.png",
  },
  {
    id: 4,
    name: "chinese",
    imageUrl:
      "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_288,h_360/MERCHANDISING_BANNERS/IMAGES/MERCH/2024/7/2/6ef07bda-b707-48ea-9b14-2594071593d1_Chinese.png",
  },
  {
    id: 5,
    name: "rolls",
    imageUrl:
      "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_288,h_360/MERCHANDISING_BANNERS/IMAGES/MERCH/2024/7/17/58760e8e-324f-479e-88fa-31800120ea38_Rolls1.png",
  },
  {
    id: 6,
    name: "cakes",
    imageUrl:
      "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_288,h_360/MERCHANDISING_BANNERS/IMAGES/MERCH/2024/7/2/8f508de7-e0ac-4ba8-b54d-def9db98959e_cake.png",
  },
  {
    id: 7,
    name: "noodles",
    imageUrl:
      "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_288,h_360/MERCHANDISING_BANNERS/IMAGES/MERCH/2024/7/2/6ef07bda-b707-48ea-9b14-2594071593d1_Noodles.png",
  },
  {
    id: 8,
    name: "momos",
    imageUrl:
      "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_288,h_360/MERCHANDISING_BANNERS/IMAGES/MERCH/2024/7/2/6ef07bda-b707-48ea-9b14-2594071593d1_Momos.png",
  },
  {
    id: 9,
    name: "ice-cream",
    imageUrl:
      "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_288,h_360/MERCHANDISING_BANNERS/IMAGES/MERCH/2024/7/2/8f508de7-e0ac-4ba8-b54d-def9db98959e_chocolate%20icecream.png",
  },
  {
    id: 10,
    name: "paratha",
    imageUrl:
      "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_288,h_360/MERCHANDISING_BANNERS/IMAGES/MERCH/2024/7/2/6ef07bda-b707-48ea-9b14-2594071593d1_Paratha.png",
  },
  {
    id: 11,
    name: "pastry",
    imageUrl:
      "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_288,h_360/MERCHANDISING_BANNERS/IMAGES/MERCH/2024/7/2/f1263395-5d4a-4775-95dc-80ab6f3bbd89_pastry.png",
  },
  {
    id: 12,
    name: "dosa",
    imageUrl:
      "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_288,h_360/MERCHANDISING_BANNERS/IMAGES/MERCH/2024/7/2/6ef07bda-b707-48ea-9b14-2594071593d1_Dosa.png",
  },
];

export const dineOutRestaurantsList: DineOutRestaurant[] = [
  {
    id: 1,
    name: "Heaven Spices",
    address: "Khajpura, Patna",
    image:
      "https://media.istockphoto.com/id/1157329688/photo/cafe-store-facade-mockup.jpg?s=612x612&w=0&k=20&c=-ea5sHQMNaS-3Wbytq_parW1POBbQ6q7zbSBffukj0k=",
    rating: 4.4,
    totalNumberOfRatings: 12,
    menuImages: [
      "https://media.istockphoto.com/id/526548484/vector/restaurant-cafe-menu-template-design.jpg?s=612x612&w=0&k=20&c=SYfOS5Qx-gcwBcSPefLBCMlJIWI1c-Kd1FeMrQc4W28=",
      "https://media.istockphoto.com/id/538032970/vector/restaurant-cafe-menu-template-design.jpg?s=612x612&w=0&k=20&c=Vm08v4e4tCSWchmDwfHpE0FWu7MWnBgt_FIZcwjxc8U=",
      "https://media.istockphoto.com/id/922873252/vector/bagel-menu-restaurant-food-template.jpg?s=612x612&w=0&k=20&c=W2o0VctnNDQRFAMUGM7wYpffEj1oIvCAyPVOWNog5sA=",
      "https://media.istockphoto.com/id/1031400596/vector/burger-flyer-for-restaurant-vector-food-menu-for-bar-and-cafe-design-template-with-vintage.jpg?s=612x612&w=0&k=20&c=pDtkMZmM1MnsWhlkDE1vUSZ42iAAKVJt-YaQYlydp_0=",
    ],
    photos: [
      "https://media.istockphoto.com/id/1162736539/photo/interior-of-a-fine-dining-indian-restaurant.jpg?s=612x612&w=0&k=20&c=h7_CK_Ylxz0Nqjj7sa_f_xWIcfxD_hZe4XnBrxaowNs=",
      "https://media.istockphoto.com/id/1312767689/photo/fine-dining-restaurant-interior.jpg?s=612x612&w=0&k=20&c=p5Eg5K_2usipfxxqJ4gSaoIkdmb_TsqlE-nfMuBiF1Y=",
      "https://media.istockphoto.com/id/1804281240/photo/empty-restaurant-fine-dining.jpg?s=612x612&w=0&k=20&c=fmLU8hFki7PdUoBTWDzkzcW4uZH9hBol3jbL93q8A0o=",
      "https://media.istockphoto.com/id/1131441486/photo/fine-dining-restaurant-in-dubai.jpg?s=612x612&w=0&k=20&c=C7CINZkuXYxCklnTXSwBgxs50UyUn_n_WjFQZl6bOtE=",
      "https://media.istockphoto.com/id/1163284610/photo/very-stylish-indian-gourmet-restaurant.jpg?s=612x612&w=0&k=20&c=-0Bz0mNjnrDoXApfo6P_xBrKmIMPZYJwQ5zAGEpzThI=",
      "https://media.istockphoto.com/id/1312767715/photo/fine-dining-restaurant-interior.jpg?s=612x612&w=0&k=20&c=qMQbVCsZn9q4v2mBj7l83BewfTgnaJiuLXXKnicbrx4=",
    ],
  },
  {
    id: 2,
    name: "Heaven Spices",
    address: "Khajpura, Patna",
    image:
      "https://media.istockphoto.com/id/1065677424/photo/restaurant-pub-in-gastown-downtown-vancouver-canada.jpg?s=612x612&w=0&k=20&c=udXxwJTJigXPHu0nhA-rOllm9o5uyeHF9jhXfInFu1A=",
    rating: 4.4,
    totalNumberOfRatings: 12,
    menuImages: [
      "https://media.istockphoto.com/id/526548484/vector/restaurant-cafe-menu-template-design.jpg?s=612x612&w=0&k=20&c=SYfOS5Qx-gcwBcSPefLBCMlJIWI1c-Kd1FeMrQc4W28=",
      "https://media.istockphoto.com/id/538032970/vector/restaurant-cafe-menu-template-design.jpg?s=612x612&w=0&k=20&c=Vm08v4e4tCSWchmDwfHpE0FWu7MWnBgt_FIZcwjxc8U=",
      "https://media.istockphoto.com/id/922873252/vector/bagel-menu-restaurant-food-template.jpg?s=612x612&w=0&k=20&c=W2o0VctnNDQRFAMUGM7wYpffEj1oIvCAyPVOWNog5sA=",
      "https://media.istockphoto.com/id/1031400596/vector/burger-flyer-for-restaurant-vector-food-menu-for-bar-and-cafe-design-template-with-vintage.jpg?s=612x612&w=0&k=20&c=pDtkMZmM1MnsWhlkDE1vUSZ42iAAKVJt-YaQYlydp_0=",
    ],
    photos: [
      "https://media.istockphoto.com/id/1162736539/photo/interior-of-a-fine-dining-indian-restaurant.jpg?s=612x612&w=0&k=20&c=h7_CK_Ylxz0Nqjj7sa_f_xWIcfxD_hZe4XnBrxaowNs=",
      "https://media.istockphoto.com/id/1312767689/photo/fine-dining-restaurant-interior.jpg?s=612x612&w=0&k=20&c=p5Eg5K_2usipfxxqJ4gSaoIkdmb_TsqlE-nfMuBiF1Y=",
      "https://media.istockphoto.com/id/1804281240/photo/empty-restaurant-fine-dining.jpg?s=612x612&w=0&k=20&c=fmLU8hFki7PdUoBTWDzkzcW4uZH9hBol3jbL93q8A0o=",
      "https://media.istockphoto.com/id/1131441486/photo/fine-dining-restaurant-in-dubai.jpg?s=612x612&w=0&k=20&c=C7CINZkuXYxCklnTXSwBgxs50UyUn_n_WjFQZl6bOtE=",
      "https://media.istockphoto.com/id/1163284610/photo/very-stylish-indian-gourmet-restaurant.jpg?s=612x612&w=0&k=20&c=-0Bz0mNjnrDoXApfo6P_xBrKmIMPZYJwQ5zAGEpzThI=",
      "https://media.istockphoto.com/id/1312767715/photo/fine-dining-restaurant-interior.jpg?s=612x612&w=0&k=20&c=qMQbVCsZn9q4v2mBj7l83BewfTgnaJiuLXXKnicbrx4=",
    ],
  },
  {
    id: 3,
    name: "Heaven Spices",
    address: "Khajpura, Patna",
    image:
      "https://media.istockphoto.com/id/1422328766/photo/cozy-street-cafe-in-manhattan-with-garland-on-the-top.jpg?s=612x612&w=0&k=20&c=QHfhboLKr2in11v3QHNhlxITaRVEZYXn2gPanTjPBKc=",
    rating: 4.4,
    totalNumberOfRatings: 12,
    menuImages: [
      "https://media.istockphoto.com/id/526548484/vector/restaurant-cafe-menu-template-design.jpg?s=612x612&w=0&k=20&c=SYfOS5Qx-gcwBcSPefLBCMlJIWI1c-Kd1FeMrQc4W28=",
      "https://media.istockphoto.com/id/538032970/vector/restaurant-cafe-menu-template-design.jpg?s=612x612&w=0&k=20&c=Vm08v4e4tCSWchmDwfHpE0FWu7MWnBgt_FIZcwjxc8U=",
      "https://media.istockphoto.com/id/922873252/vector/bagel-menu-restaurant-food-template.jpg?s=612x612&w=0&k=20&c=W2o0VctnNDQRFAMUGM7wYpffEj1oIvCAyPVOWNog5sA=",
      "https://media.istockphoto.com/id/1031400596/vector/burger-flyer-for-restaurant-vector-food-menu-for-bar-and-cafe-design-template-with-vintage.jpg?s=612x612&w=0&k=20&c=pDtkMZmM1MnsWhlkDE1vUSZ42iAAKVJt-YaQYlydp_0=",
    ],
    photos: [
      "https://media.istockphoto.com/id/1162736539/photo/interior-of-a-fine-dining-indian-restaurant.jpg?s=612x612&w=0&k=20&c=h7_CK_Ylxz0Nqjj7sa_f_xWIcfxD_hZe4XnBrxaowNs=",
      "https://media.istockphoto.com/id/1312767689/photo/fine-dining-restaurant-interior.jpg?s=612x612&w=0&k=20&c=p5Eg5K_2usipfxxqJ4gSaoIkdmb_TsqlE-nfMuBiF1Y=",
      "https://media.istockphoto.com/id/1804281240/photo/empty-restaurant-fine-dining.jpg?s=612x612&w=0&k=20&c=fmLU8hFki7PdUoBTWDzkzcW4uZH9hBol3jbL93q8A0o=",
      "https://media.istockphoto.com/id/1131441486/photo/fine-dining-restaurant-in-dubai.jpg?s=612x612&w=0&k=20&c=C7CINZkuXYxCklnTXSwBgxs50UyUn_n_WjFQZl6bOtE=",
      "https://media.istockphoto.com/id/1163284610/photo/very-stylish-indian-gourmet-restaurant.jpg?s=612x612&w=0&k=20&c=-0Bz0mNjnrDoXApfo6P_xBrKmIMPZYJwQ5zAGEpzThI=",
      "https://media.istockphoto.com/id/1312767715/photo/fine-dining-restaurant-interior.jpg?s=612x612&w=0&k=20&c=qMQbVCsZn9q4v2mBj7l83BewfTgnaJiuLXXKnicbrx4=",
    ],
  },
  {
    id: 4,
    name: "Heaven Spices",
    address: "Khajpura, Patna",
    image:
      "https://media.istockphoto.com/id/1277176136/photo/empty-coffee-and-restaurant-terrace-with-tables-and-chairs-in-london-indie-and-hipster-style.jpg?s=612x612&w=0&k=20&c=93D50nlTsG5td6mpC-PiRhm56PEl-8aZpa5_NHSUiSU=",
    rating: 4.4,
    totalNumberOfRatings: 12,
    menuImages: [
      "https://media.istockphoto.com/id/526548484/vector/restaurant-cafe-menu-template-design.jpg?s=612x612&w=0&k=20&c=SYfOS5Qx-gcwBcSPefLBCMlJIWI1c-Kd1FeMrQc4W28=",
      "https://media.istockphoto.com/id/538032970/vector/restaurant-cafe-menu-template-design.jpg?s=612x612&w=0&k=20&c=Vm08v4e4tCSWchmDwfHpE0FWu7MWnBgt_FIZcwjxc8U=",
      "https://media.istockphoto.com/id/922873252/vector/bagel-menu-restaurant-food-template.jpg?s=612x612&w=0&k=20&c=W2o0VctnNDQRFAMUGM7wYpffEj1oIvCAyPVOWNog5sA=",
      "https://media.istockphoto.com/id/1031400596/vector/burger-flyer-for-restaurant-vector-food-menu-for-bar-and-cafe-design-template-with-vintage.jpg?s=612x612&w=0&k=20&c=pDtkMZmM1MnsWhlkDE1vUSZ42iAAKVJt-YaQYlydp_0=",
    ],
    photos: [
      "https://media.istockphoto.com/id/1162736539/photo/interior-of-a-fine-dining-indian-restaurant.jpg?s=612x612&w=0&k=20&c=h7_CK_Ylxz0Nqjj7sa_f_xWIcfxD_hZe4XnBrxaowNs=",
      "https://media.istockphoto.com/id/1312767689/photo/fine-dining-restaurant-interior.jpg?s=612x612&w=0&k=20&c=p5Eg5K_2usipfxxqJ4gSaoIkdmb_TsqlE-nfMuBiF1Y=",
      "https://media.istockphoto.com/id/1804281240/photo/empty-restaurant-fine-dining.jpg?s=612x612&w=0&k=20&c=fmLU8hFki7PdUoBTWDzkzcW4uZH9hBol3jbL93q8A0o=",
      "https://media.istockphoto.com/id/1131441486/photo/fine-dining-restaurant-in-dubai.jpg?s=612x612&w=0&k=20&c=C7CINZkuXYxCklnTXSwBgxs50UyUn_n_WjFQZl6bOtE=",
      "https://media.istockphoto.com/id/1163284610/photo/very-stylish-indian-gourmet-restaurant.jpg?s=612x612&w=0&k=20&c=-0Bz0mNjnrDoXApfo6P_xBrKmIMPZYJwQ5zAGEpzThI=",
      "https://media.istockphoto.com/id/1312767715/photo/fine-dining-restaurant-interior.jpg?s=612x612&w=0&k=20&c=qMQbVCsZn9q4v2mBj7l83BewfTgnaJiuLXXKnicbrx4=",
    ],
  },
  {
    id: 5,
    name: "Heaven Spices",
    address: "Khajpura, Patna",
    image:
      "https://media.istockphoto.com/id/927019058/photo/green-cafe-on-a-small-street.jpg?s=612x612&w=0&k=20&c=O4iZumzQnN_FdSWDFqBvrQ28fEvUf3XkfU7KwKR1u1I=",
    rating: 4.4,
    totalNumberOfRatings: 12,
    menuImages: [
      "https://media.istockphoto.com/id/526548484/vector/restaurant-cafe-menu-template-design.jpg?s=612x612&w=0&k=20&c=SYfOS5Qx-gcwBcSPefLBCMlJIWI1c-Kd1FeMrQc4W28=",
      "https://media.istockphoto.com/id/538032970/vector/restaurant-cafe-menu-template-design.jpg?s=612x612&w=0&k=20&c=Vm08v4e4tCSWchmDwfHpE0FWu7MWnBgt_FIZcwjxc8U=",
      "https://media.istockphoto.com/id/922873252/vector/bagel-menu-restaurant-food-template.jpg?s=612x612&w=0&k=20&c=W2o0VctnNDQRFAMUGM7wYpffEj1oIvCAyPVOWNog5sA=",
      "https://media.istockphoto.com/id/1031400596/vector/burger-flyer-for-restaurant-vector-food-menu-for-bar-and-cafe-design-template-with-vintage.jpg?s=612x612&w=0&k=20&c=pDtkMZmM1MnsWhlkDE1vUSZ42iAAKVJt-YaQYlydp_0=",
    ],
    photos: [
      "https://media.istockphoto.com/id/1162736539/photo/interior-of-a-fine-dining-indian-restaurant.jpg?s=612x612&w=0&k=20&c=h7_CK_Ylxz0Nqjj7sa_f_xWIcfxD_hZe4XnBrxaowNs=",
      "https://media.istockphoto.com/id/1312767689/photo/fine-dining-restaurant-interior.jpg?s=612x612&w=0&k=20&c=p5Eg5K_2usipfxxqJ4gSaoIkdmb_TsqlE-nfMuBiF1Y=",
      "https://media.istockphoto.com/id/1804281240/photo/empty-restaurant-fine-dining.jpg?s=612x612&w=0&k=20&c=fmLU8hFki7PdUoBTWDzkzcW4uZH9hBol3jbL93q8A0o=",
      "https://media.istockphoto.com/id/1131441486/photo/fine-dining-restaurant-in-dubai.jpg?s=612x612&w=0&k=20&c=C7CINZkuXYxCklnTXSwBgxs50UyUn_n_WjFQZl6bOtE=",
      "https://media.istockphoto.com/id/1163284610/photo/very-stylish-indian-gourmet-restaurant.jpg?s=612x612&w=0&k=20&c=-0Bz0mNjnrDoXApfo6P_xBrKmIMPZYJwQ5zAGEpzThI=",
      "https://media.istockphoto.com/id/1312767715/photo/fine-dining-restaurant-interior.jpg?s=612x612&w=0&k=20&c=qMQbVCsZn9q4v2mBj7l83BewfTgnaJiuLXXKnicbrx4=",
    ],
  },
  {
    id: 6,
    name: "Heaven Spices",
    address: "Khajpura, Patna",
    image:
      "https://media.istockphoto.com/id/1059273012/photo/montmartre-in-paris-france.jpg?s=612x612&w=0&k=20&c=zM_ouiDaeRy21evIq872Oa1ivhZawuCQV2lXMNySk3U=",
    rating: 4.4,
    totalNumberOfRatings: 12,
    menuImages: [
      "https://media.istockphoto.com/id/526548484/vector/restaurant-cafe-menu-template-design.jpg?s=612x612&w=0&k=20&c=SYfOS5Qx-gcwBcSPefLBCMlJIWI1c-Kd1FeMrQc4W28=",
      "https://media.istockphoto.com/id/538032970/vector/restaurant-cafe-menu-template-design.jpg?s=612x612&w=0&k=20&c=Vm08v4e4tCSWchmDwfHpE0FWu7MWnBgt_FIZcwjxc8U=",
      "https://media.istockphoto.com/id/922873252/vector/bagel-menu-restaurant-food-template.jpg?s=612x612&w=0&k=20&c=W2o0VctnNDQRFAMUGM7wYpffEj1oIvCAyPVOWNog5sA=",
      "https://media.istockphoto.com/id/1031400596/vector/burger-flyer-for-restaurant-vector-food-menu-for-bar-and-cafe-design-template-with-vintage.jpg?s=612x612&w=0&k=20&c=pDtkMZmM1MnsWhlkDE1vUSZ42iAAKVJt-YaQYlydp_0=",
    ],
    photos: [
      "https://media.istockphoto.com/id/1162736539/photo/interior-of-a-fine-dining-indian-restaurant.jpg?s=612x612&w=0&k=20&c=h7_CK_Ylxz0Nqjj7sa_f_xWIcfxD_hZe4XnBrxaowNs=",
      "https://media.istockphoto.com/id/1312767689/photo/fine-dining-restaurant-interior.jpg?s=612x612&w=0&k=20&c=p5Eg5K_2usipfxxqJ4gSaoIkdmb_TsqlE-nfMuBiF1Y=",
      "https://media.istockphoto.com/id/1804281240/photo/empty-restaurant-fine-dining.jpg?s=612x612&w=0&k=20&c=fmLU8hFki7PdUoBTWDzkzcW4uZH9hBol3jbL93q8A0o=",
      "https://media.istockphoto.com/id/1131441486/photo/fine-dining-restaurant-in-dubai.jpg?s=612x612&w=0&k=20&c=C7CINZkuXYxCklnTXSwBgxs50UyUn_n_WjFQZl6bOtE=",
      "https://media.istockphoto.com/id/1163284610/photo/very-stylish-indian-gourmet-restaurant.jpg?s=612x612&w=0&k=20&c=-0Bz0mNjnrDoXApfo6P_xBrKmIMPZYJwQ5zAGEpzThI=",
      "https://media.istockphoto.com/id/1312767715/photo/fine-dining-restaurant-interior.jpg?s=612x612&w=0&k=20&c=qMQbVCsZn9q4v2mBj7l83BewfTgnaJiuLXXKnicbrx4=",
    ],
  },
  {
    id: 7,
    name: "Heaven Spices",
    address: "Khajpura, Patna",
    image:
      "https://media.istockphoto.com/id/813380370/photo/antwerp-city-in-belgium.jpg?s=612x612&w=0&k=20&c=DsKAVyRSw26sndMDKR5aFxVcvTdF_8szTQmGom3rutk=",
    rating: 4.4,
    totalNumberOfRatings: 12,
    menuImages: [
      "https://media.istockphoto.com/id/526548484/vector/restaurant-cafe-menu-template-design.jpg?s=612x612&w=0&k=20&c=SYfOS5Qx-gcwBcSPefLBCMlJIWI1c-Kd1FeMrQc4W28=",
      "https://media.istockphoto.com/id/538032970/vector/restaurant-cafe-menu-template-design.jpg?s=612x612&w=0&k=20&c=Vm08v4e4tCSWchmDwfHpE0FWu7MWnBgt_FIZcwjxc8U=",
      "https://media.istockphoto.com/id/922873252/vector/bagel-menu-restaurant-food-template.jpg?s=612x612&w=0&k=20&c=W2o0VctnNDQRFAMUGM7wYpffEj1oIvCAyPVOWNog5sA=",
      "https://media.istockphoto.com/id/1031400596/vector/burger-flyer-for-restaurant-vector-food-menu-for-bar-and-cafe-design-template-with-vintage.jpg?s=612x612&w=0&k=20&c=pDtkMZmM1MnsWhlkDE1vUSZ42iAAKVJt-YaQYlydp_0=",
    ],
    photos: [
      "https://media.istockphoto.com/id/1162736539/photo/interior-of-a-fine-dining-indian-restaurant.jpg?s=612x612&w=0&k=20&c=h7_CK_Ylxz0Nqjj7sa_f_xWIcfxD_hZe4XnBrxaowNs=",
      "https://media.istockphoto.com/id/1312767689/photo/fine-dining-restaurant-interior.jpg?s=612x612&w=0&k=20&c=p5Eg5K_2usipfxxqJ4gSaoIkdmb_TsqlE-nfMuBiF1Y=",
      "https://media.istockphoto.com/id/1804281240/photo/empty-restaurant-fine-dining.jpg?s=612x612&w=0&k=20&c=fmLU8hFki7PdUoBTWDzkzcW4uZH9hBol3jbL93q8A0o=",
      "https://media.istockphoto.com/id/1131441486/photo/fine-dining-restaurant-in-dubai.jpg?s=612x612&w=0&k=20&c=C7CINZkuXYxCklnTXSwBgxs50UyUn_n_WjFQZl6bOtE=",
      "https://media.istockphoto.com/id/1163284610/photo/very-stylish-indian-gourmet-restaurant.jpg?s=612x612&w=0&k=20&c=-0Bz0mNjnrDoXApfo6P_xBrKmIMPZYJwQ5zAGEpzThI=",
      "https://media.istockphoto.com/id/1312767715/photo/fine-dining-restaurant-interior.jpg?s=612x612&w=0&k=20&c=qMQbVCsZn9q4v2mBj7l83BewfTgnaJiuLXXKnicbrx4=",
    ],
  },
];

export const restaurantType: RestaurantTypeTypes[] = [
  {
    id: 0,
    type: "Pure veg",
    image: require("assets/pureVeg.jpg"),
  },
  {
    id: 1,
    type: "Family Dining",
    image: require("assets/familyDining.jpg"),
  },
  {
    id: 2,
    type: "Outdoor Dining",
    image: require("assets/outdoor.jpg"),
  },
  {
    id: 3,
    type: "Cafe",
    image: require("assets/cafe.jpg"),
  },
  {
    id: 4,
    type: "Breakfast",
    image: require("assets/breakfast.jpg"),
  },
  {
    id: 5,
    type: "Drink & Dine",
    image: require("assets/drinkAndDine.jpg"),
  },
];

export type RestaurantTypeTypes = {
  id: number;
  type: string;
  image: ImageRequireSource;
};

export const filtersOption = [
  "veg",
  "Non-veg",
  "Nearest",
  "Great Offers",
  "Rating 4.0",
  "Less Than Rs. 300",
  "Grater Than Rs. 600",
];

export const restaurantsItemFiltersOption = [
  "Veg",
  "Non-veg",
  "Rating 4.0",
  "Bestseller",
  "Spicy",
  "Sweets",
];

export type DineOutRestaurant = {
  id: number;
  name: string;
  address: string;
  image: string;
  rating: number;
  totalNumberOfRatings: number;
  menuImages: string[];
  photos: string[];
};
export type CustomizationOption = {
  name: string;
  price: number;
};

export type CustomizationGroup = {
  type: string;
  options: CustomizationOption[];
  required?: boolean;
};

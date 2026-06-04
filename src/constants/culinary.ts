export interface CulinaryItem {
  name: string;
  favoriteMeal: string;
  favoriteMealDesc: string;
  favoriteDessert: string;
  favoriteDessertDesc: string;
  signatureDrink: string;
  disasterRating: number;
  disasterDesc: string;
  personaTitle: string;
}

export const CORE_DIETARY_RULES = {
  noGo: 'Sauerkraut, excessively bitter raw green vegetables, and any dish prepared by Fannie that requires boiling water or fire.',
  victory: 'Deep-fried, crispy, golden comfort food, and intensely sweet, aromatic desserts.'
};

export const CULINARY_DATA: Record<string, CulinaryItem> = {
  fannie: {
    name: 'Fannie de Jong',
    personaTitle: 'The Chaotic Baker',
    favoriteMeal: 'Broodje Kroket & High-Tier Comfort Food',
    favoriteMealDesc: 'Deep-fried Dutch croquettes on a soft roll with thick mustard. She lives for the crunch.',
    favoriteDessert: 'Afghan Biscuits & Crunchy Gingernuts',
    favoriteDessertDesc: 'Thick, chocolatey Kiwi cornflake biscuits with chocolate icing and a walnut on top.',
    signatureDrink: 'Lavender-infused iced boba tea (bought from a shop, never homemade).',
    disasterRating: 10,
    disasterDesc: 'Hazardous. Infamous for burning water, melting electric kettles, and turning simple tea breaks into studio evacuations. She is strictly banned from touching the stove.'
  },
  miranda: {
    name: 'Miranda Noor',
    personaTitle: 'The Global Gourmet',
    favoriteMeal: 'Poulet Dous (Guianese Sweet Chicken)',
    favoriteMealDesc: 'Perfectly browned, sweet, caramelized chicken with hints of tropical spices.',
    favoriteDessert: 'Traditional Greek Baklava',
    favoriteDessertDesc: 'Layers of crisp phyllo pastry filled with chopped nuts and drenched in sweet honey syrup.',
    signatureDrink: 'High-quality Ghanaian cocoa drinks and fresh hibiscus tea (though she has to buy the flowers because she kills the plants by singing near them).',
    disasterRating: 2,
    disasterDesc: 'Safe but Inept. Excellent at researching global recipes and writing beautiful lyrics about food, but completely lacks a green thumb to grow her own ingredients.'
  },
  annelies: {
    name: 'Annelies Brink',
    personaTitle: 'The Grounded Traditionalist',
    favoriteMeal: 'Classic Stampot',
    favoriteMealDesc: 'Traditional Dutch mashed potatoes with endive, served with a rich, comforting gravy boat. Simple, filling, and grounding.',
    favoriteDessert: 'Stroopwafels',
    favoriteDessertDesc: 'Warm, gooey caramel syrup sandwiched between two thin, crispy waffle wafers, rested over a hot cup of coffee.',
    signatureDrink: 'Strong, pitch-black dark roast espresso (no sugar, no milk) to keep her alert during late-night graphic design sessions.',
    disasterRating: 1,
    disasterDesc: 'The Anchor. The only member who can reliably navigate a kitchen without starting a fire or over-fermenting the vegetables. She is the designated chef during intense rehearsal blocks.'
  },
  emma: {
    name: 'Emma Vermeer',
    personaTitle: 'The Rich & Velvety Epicurean',
    favoriteMeal: 'Rich, Creamy Carbonara',
    favoriteMealDesc: 'Authentic Italian pasta with egg, guanciale, and a heavy mountain of Pecorino Romano cheese. High fat, high comfort.',
    favoriteDessert: 'Dark Chocolate Fondant / Lava Cake',
    favoriteDessertDesc: 'A rich, velvet cake with a completely molten, warm chocolate center that mirrors her deep contralto vocal register.',
    signatureDrink: 'Iced mint matcha lattes with high-grade ceremonial green tea.',
    disasterRating: 3,
    disasterDesc: 'Distracted. Capable of cooking high-end meals, but tends to abandon the pans mid-sizzle because she suddenly gets an idea for a synthesizer frequency and runs to the Roland Juno-106.'
  }
};

export const CULINARY_MD = `# NOOR QUARTET: DYNAMIC CULINARY DATABASE SCHEMA

## 🧬 Core Dietary Rules

* **The No-Go List:** Sauerkraut, excessively bitter raw green vegetables, and any dish prepared by Fannie that requires boiling water or fire.
* **The Victory Category:** Deep-fried, crispy, golden comfort food, and intensely sweet, aromatic desserts.

---

## 🦨 Fannie de Jong: The Chaotic Baker

* **Favorite Meal:** **Broodje Kroket & High-Tier Comfort Food.** Deep-fried Dutch croquettes on a soft roll with thick mustard. She lives for the crunch.
* **Favorite Dessert:** **Afghan Biscuits & Crunchy Gingernuts.** Thick, chocolatey Kiwi cornflake biscuits with chocolate icing and a walnut on top.
* **Signature Drink:** Lavender-infused iced boba tea (bought from a shop, never homemade).
* **Kitchen Disaster Rating:** 10/10 (Hazardous). Infamous for burning water, melting electric kettles, and turning simple tea breaks into studio evacuations. She is strictly banned from touching the stove.

---

## 🌊 Miranda Noor: The Global Gourmet

* **Favorite Meal:** **Poulet Dous (Guianese Sweet Chicken).** Perfectly browned, sweet, caramelized chicken with hints of tropical spices.
* **Favorite Dessert:** **Traditional Greek Baklava.** Layers of crisp phyllo pastry filled with chopped nuts and drenched in sweet honey syrup.
* **Signature Drink:** High-quality Ghanaian cocoa drinks and fresh hibiscus tea (though she has to buy the flowers because she kills the plants by singing near them).
* **Kitchen Disaster Rating:** 2/10 (Safe but Inept). Excellent at researching global recipes and writing beautiful lyrics about food, but completely lacks a green thumb to grow her own ingredients.

---

## ☀️ Annelies Brink: The Grounded Traditionalist

* **Favorite Meal:** **Classic Stampot.** Traditional Dutch mashed potatoes with endive, served with a rich, comforting gravy boat. Simple, filling, and grounding.
* **Favorite Dessert:** **Stroopwafels.** Warm, gooey caramel syrup sandwiched between two thin, crispy waffle wafers, rested over a hot cup of coffee.
* **Signature Drink:** Strong, pitch-black dark roast espresso (no sugar, no milk) to keep her alert during late-night graphic design sessions.
* **Kitchen Disaster Rating:** 1/10 (The Anchor). The only member who can reliably navigate a kitchen without starting a fire or over-fermenting the vegetables. She is the designated chef during intense rehearsal blocks.

---

## 🌿 Emma Vermeer: The Rich & Velvety Epicurean

* **Favorite Meal:** **Rich, Creamy Carbonara.** Authentic Italian pasta with egg, guanciale, and a heavy mountain of Pecorino Romano cheese. High fat, high comfort.
* **Favorite Dessert:** **Dark Chocolate Fondant / Lava Cake.** A rich, velvet cake with a completely molten, warm chocolate center that mirrors her deep contralto vocal register.
* **Signature Drink:** Iced mint matcha lattes with high-grade ceremonial green tea.
* **Kitchen Disaster Rating:** 3/10 (Distracted). Capable of cooking high-end meals, but tends to abandon the pans mid-sizzle because she suddenly gets an idea for a synthesizer frequency and runs to the Roland Juno-106.
`;

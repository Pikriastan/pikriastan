import type Database from "better-sqlite3";
import type { ProductInput } from "./db";

const SEED_PRODUCTS: ProductInput[] = [
  {
    slug: "long-wool-overcoat",
    name: {
      en: "Long Wool Overcoat",
      ka: "გრძელი მატყლის პალტო",
    },
    description: {
      en: "Heavy double-faced wool, raw selvedge edges, hand-finished buttonholes. A garment for long winter mornings.",
      ka: "ორმაგი ფაქტურის მძიმე მატყლი, ნედლი კიდეები, ხელით დასრულებული ღილკილოები. ნაკეთობა ცივი ზამთრის დილებისთვის.",
    },
    category: { en: "Outerwear", ka: "გარესაცმელი" },
    price: 1850,
    currency: "GEL",
    images: ["/seed/overcoat-1.jpg", "/seed/overcoat-2.jpg"],
    featured: true,
    published: true,
  },
  {
    slug: "white-linen-shirt",
    name: {
      en: "White Linen Shirt",
      ka: "თეთრი თეთრეულის პერანგი",
    },
    description: {
      en: "Belgian linen with mother-of-pearl buttons. Cut wide through the body, narrow at the cuff. Improves with every wash.",
      ka: "ბელგიური თეთრეული მარგალიტის ფერის ღილებით. განიერი ჭრილი, ვიწრო მანჟეტი. ყოველ რეცხვაზე უმჯობესდება.",
    },
    category: { en: "Shirts", ka: "პერანგები" },
    price: 420,
    currency: "GEL",
    images: ["/seed/shirt-1.jpg", "/seed/shirt-2.jpg"],
    featured: true,
    published: true,
  },
  {
    slug: "wool-cashmere-knit",
    name: {
      en: "Wool Cashmere Knit",
      ka: "მატყლი-კაშმირის სვიტერი",
    },
    description: {
      en: "Hand-loomed in Italy from a wool-cashmere blend. Slightly cropped, slightly oversized. The kind of sweater you live in.",
      ka: "იტალიაში ნაქსოვი მატყლი-კაშმირის ნაერთისგან. ოდნავ მოკლე, ოდნავ თავისუფალი. სვიტერი, რომელშიც ცხოვრობ.",
    },
    category: { en: "Knitwear", ka: "ნაქსოვი" },
    price: 780,
    currency: "GEL",
    images: ["/seed/knit-1.jpg", "/seed/knit-2.jpg"],
    featured: true,
    published: true,
  },
  {
    slug: "pleated-linen-trousers",
    name: {
      en: "Pleated Linen Trousers",
      ka: "თეთრეულის შარვალი",
    },
    description: {
      en: "High-waisted, double-pleated, finished with a turn-up. A trouser built around how the body moves, not how it is measured.",
      ka: "მაღალწელიანი, ორმაგი ნაკეცებით, კიდეები ამოკეცილი. შარვალი, რომელიც სხეულის მოძრაობაზეა აგებული.",
    },
    category: { en: "Trousers", ka: "შარვლები" },
    price: 540,
    currency: "GEL",
    images: ["/seed/trousers-1.jpg", "/seed/trousers-2.jpg"],
    featured: false,
    published: true,
  },
  {
    slug: "silk-slip-dress",
    name: {
      en: "Silk Slip Dress",
      ka: "აბრეშუმის კაბა",
    },
    description: {
      en: "Bias-cut silk with a low back and narrow straps. Numbered run of 12. Photographed without retouching.",
      ka: "დახრილად მოჭრილი აბრეშუმი, ღია ზურგი და ვიწრო ბრეტელები. შეზღუდული 12 ცალით. ფოტო რეტუშის გარეშე.",
    },
    category: { en: "Dresses", ka: "კაბები" },
    price: 1240,
    currency: "GEL",
    images: ["/seed/dress-1.jpg", "/seed/dress-2.jpg"],
    featured: true,
    published: true,
  },
  {
    slug: "leather-tote",
    name: {
      en: "Vegetable-Tanned Tote",
      ka: "ხელნაკეთი ტყავის ჩანთა",
    },
    description: {
      en: "Italian vegetable-tanned leather, edge-painted by hand. Made to soften and darken with daily use.",
      ka: "იტალიური მცენარეულად დათრიმლული ტყავი, კიდეები ხელით შეღებილი. ყოველდღიური გამოყენებით რბილდება და მუქდება.",
    },
    category: { en: "Accessories", ka: "აქსესუარები" },
    price: 690,
    currency: "GEL",
    images: ["/seed/tote-1.jpg", "/seed/tote-2.jpg"],
    featured: false,
    published: true,
  },
];

export function maybeSeed(db: Database.Database): void {
  const row = db.prepare("SELECT COUNT(*) AS c FROM products").get() as {
    c: number;
  };
  if (row.c > 0) return;

  const now = Date.now();
  const insert = db.prepare(
    `INSERT INTO products
      (id, slug, name_en, name_ka, description_en, description_ka,
       price, currency, category_en, category_ka, images_json,
       featured, published, created_at, updated_at)
     VALUES
      (@id, @slug, @name_en, @name_ka, @description_en, @description_ka,
       @price, @currency, @category_en, @category_ka, @images_json,
       @featured, @published, @created_at, @updated_at)`,
  );

  const insertAll = db.transaction((rows: ProductInput[]) => {
    rows.forEach((p, i) => {
      insert.run({
        id: `seed-${i + 1}-${Math.random().toString(36).slice(2, 8)}`,
        slug: p.slug,
        name_en: p.name.en,
        name_ka: p.name.ka,
        description_en: p.description.en,
        description_ka: p.description.ka,
        price: p.price,
        currency: p.currency,
        category_en: p.category.en,
        category_ka: p.category.ka,
        images_json: JSON.stringify(p.images),
        featured: p.featured ? 1 : 0,
        published: p.published ? 1 : 0,
        // stagger created_at so the order on /collection is stable & feels designed
        created_at: now - i * 1000,
        updated_at: now - i * 1000,
      });
    });
  });

  insertAll(SEED_PRODUCTS);
}

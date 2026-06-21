import type { Locale } from "@/lib/constants.ts";

export interface Dictionary {
  about: {
    title: string;
    intro: string;
    body1: string;
    body2: string;
    values: { title: string; body: string }[];
  };
  admin: {
    loginTitle: string;
    emailLabel: string;
    passwordLabel: string;
    loginButton: string;
    loginError: string;
    dashboardTitle: string;
    dashboardSubtitle: string;
    newProduct: string;
    logout: string;
    productsHeader: string;
    noProducts: string;
    empty: string;
    edit: string;
    delete: string;
    confirmDelete: string;
    formTitleNew: string;
    formTitleEdit: string;
    fieldSlug: string;
    fieldSlugHelp: string;
    fieldNameEn: string;
    fieldNameKa: string;
    fieldDescriptionEn: string;
    fieldDescriptionKa: string;
    fieldCategoryEn: string;
    fieldCategoryKa: string;
    fieldPrice: string;
    fieldCurrency: string;
    fieldFeatured: string;
    fieldPublished: string;
    fieldImages: string;
    uploadImages: string;
    uploading: string;
    save: string;
    saving: string;
    cancel: string;
    saved: string;
    saveError: string;
    removeImage: string;
    featured: string;
    draft: string;
    published: string;
  };
  brand: { tagline: string };
  collection: {
    title: string;
    subtitle: string;
    empty: string;
    sortNewest: string;
    countOne: string;
    countMany: (n: number) => string;
  };
  footer: {
    rights: string;
    madeIn: string;
    languageLabel: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    cta: string;
    secondary: string;
  };
  home: {
    featuredEyebrow: string;
    featuredTitle: string;
    viewAll: string;
    storyEyebrow: string;
    storyTitle: string;
    storyBody: string;
    aboutCta: string;
    manifestoTitle: string;
    manifestoLines: string[];
  };
  nav: {
    home: string;
    collection: string;
    about: string;
    contact: string;
  };
  notFound: {
    eyebrow: string;
    code: string;
    title: string;
    body: string;
    home: string;
    collection: string;
  };
  product: {
    back: string;
    description: string;
    details: string;
    soldOutSoon: string;
    inquire: string;
    notFound: string;
    notFoundBody: string;
    price: string;
    category: string;
    noDescription: string;
  };
}

const en: Dictionary = {
  brand: { tagline: "Garments for the unseen hours." },
  nav: {
    home: "Home",
    collection: "Collection",
    about: "Studio",
    contact: "Contact",
  },
  hero: {
    eyebrow: "Vol. 01",
    title: "Worn by silence.",
    subtitle:
      "An independent garment studio working from Tbilisi. Considered cuts, raw textures, and a quiet refusal of trend.",
    cta: "Explore the collection",
    secondary: "Read the studio notes",
  },
  home: {
    featuredEyebrow: "Selected pieces",
    featuredTitle: "The current chapter",
    viewAll: "View entire collection",
    storyEyebrow: "Studio note",
    storyTitle: "A practice, not a brand.",
    storyBody:
      "Each piece is patterned, cut and assembled in small runs. We do not chase seasons. We document a posture \u2014 of the body, of the city, of a long winter morning.",
    aboutCta: "About the studio",
    manifestoTitle: "Manifesto",
    manifestoLines: [
      "Less of everything.",
      "Cut for weight, not noise.",
      "Black, off-black, the colour of paper.",
      "Wearable for years.",
      "Made where it is sold.",
    ],
  },
  collection: {
    title: "Collection",
    subtitle: "Every piece in the current archive.",
    empty: "The archive is currently empty. New pieces are being prepared.",
    sortNewest: "Most recent",
    countOne: "1 piece",
    countMany: (n: number) => `${n} pieces`,
  },
  notFound: {
    eyebrow: "Error 404",
    code: "404",
    title: "This page slipped out of frame.",
    body: "The page you are looking for has been moved, archived, or never existed. The collection, however, is still here.",
    home: "Return home",
    collection: "Browse the collection",
  },
  product: {
    back: "Back to collection",
    description: "Description",
    details: "Details",
    soldOutSoon: "Limited run",
    inquire: "Inquire about this piece",
    notFound: "This piece has been archived",
    notFoundBody:
      "The garment you are looking for is no longer part of the active collection.",
    price: "Price",
    category: "Category",
    noDescription: "No description yet. This piece speaks for itself.",
  },
  about: {
    title: "Studio",
    intro:
      "Pikriastan is a quiet, garment-focused practice operating from Tbilisi.",
    body1:
      "We work in small numbered runs, with an emphasis on weight, drape and an honest construction. Patterns are developed slowly. Many are reworked across multiple seasons before they are released.",
    body2:
      "There is no online checkout. If a piece is right, please write to the studio. We prefer slow conversations over fast carts.",
    values: [
      {
        title: "Made in Tbilisi",
        body: "Patterned, cut and stitched within walking distance of the studio.",
      },
      {
        title: "Numbered runs",
        body: "Each piece is part of a finite series. No restocks, no replicas.",
      },
      {
        title: "Lifetime mending",
        body: "If a seam fails, return it. We will repair what we make.",
      },
    ],
  },
  footer: {
    rights: "All rights reserved.",
    madeIn: "Studio \u2014 Tbilisi",
    languageLabel: "Language",
  },
  admin: {
    loginTitle: "Studio access",
    emailLabel: "Email",
    passwordLabel: "Password",
    loginButton: "Enter",
    loginError: "Incorrect password.",
    dashboardTitle: "Studio",
    dashboardSubtitle: "Curate, edit, publish.",
    newProduct: "New piece",
    logout: "Sign out",
    productsHeader: "Archive",
    noProducts: "No pieces yet. Add the first one.",
    empty: "The archive is currently empty. New pieces are being prepared.",
    edit: "Edit",
    delete: "Delete",
    confirmDelete: "Delete this piece permanently?",
    formTitleNew: "New piece",
    formTitleEdit: "Edit piece",
    fieldSlug: "Slug",
    fieldSlugHelp: "Lowercase, dashes only. Used in the URL.",
    fieldNameEn: "Name (English)",
    fieldNameKa: "Name (Georgian)",
    fieldDescriptionEn: "Description (English)",
    fieldDescriptionKa: "Description (Georgian)",
    fieldCategoryEn: "Category (English)",
    fieldCategoryKa: "Category (Georgian)",
    fieldPrice: "Price",
    fieldCurrency: "Currency",
    fieldFeatured: "Feature on home page",
    fieldPublished: "Published (visible to public)",
    fieldImages: "Images",
    uploadImages: "Upload images",
    uploading: "Uploading\u2026",
    save: "Save",
    saving: "Saving\u2026",
    cancel: "Cancel",
    saved: "Saved.",
    saveError: "Something went wrong.",
    removeImage: "Remove",
    featured: "Featured",
    draft: "Draft",
    published: "Live",
  },
};

const ka: Dictionary = {
  brand: { tagline: "ტანსაცმელი უხილავი საათებისთვის." },
  nav: {
    home: "მთავარი",
    collection: "კოლექცია",
    about: "სტუდია",
    contact: "კონტაქტი",
  },
  hero: {
    eyebrow: "ტომი 01",
    title: "ჩაცმული სიჩუმე.",
    subtitle:
      "დამოუკიდებელი სტუდია თბილისიდან. დაფიქრებული ჭრილი, ნედლი ფაქტურა და მდუმარე უარი ტრენდზე.",
    cta: "კოლექციის ნახვა",
    secondary: "სტუდიის ჩანაწერები",
  },
  home: {
    featuredEyebrow: "შერჩეული ნაკეთობები",
    featuredTitle: "მიმდინარე თავი",
    viewAll: "მთლიანი კოლექციის ნახვა",
    storyEyebrow: "სტუდიის ჩანაწერი",
    storyTitle: "პრაქტიკა, არა ბრენდი.",
    storyBody:
      "თითოეული ნაკეთობა ხელით იჭრება და იკერება მცირე სერიებად. ჩვენ არ ვაკეთებთ სეზონებს. ჩვენ ვაფიქსირებთ პოზას — სხეულის, ქალაქის და გრძელი ზამთრის დილის.",
    aboutCta: "სტუდიის შესახებ",
    manifestoTitle: "მანიფესტი",
    manifestoLines: [
      "ნაკლები — ყველაფერი.",
      "მოჭრილი წონისთვის, არა ხმაურისთვის.",
      "შავი, ნახევრად შავი, ქაღალდის ფერი.",
      "წლების სატარებელი.",
      "გაკეთებული იქ, სადაც იყიდება.",
    ],
  },
  collection: {
    title: "კოლექცია",
    subtitle: "ყველა ნაკეთობა მიმდინარე არქივიდან.",
    empty: "არქივი ამჟამად ცარიელია. ახალი ნამუშევრები მზადდება.",
    sortNewest: "უახლესი",
    countOne: "1 ნაკეთობა",
    countMany: (n: number) => `${n} ნაკეთობა`,
  },
  notFound: {
    eyebrow: "შეცდომა 404",
    code: "404",
    title: "ეს გვერდი კადრს გასცდა.",
    body: "გვერდი, რომელსაც ეძებთ, გადატანილია, დაარქივებულია ან საერთოდ არ არსებობდა. კოლექცია კი ისევ აქ არის.",
    home: "მთავარზე დაბრუნება",
    collection: "კოლექციის დათვალიერება",
  },
  product: {
    back: "კოლექციაში დაბრუნება",
    description: "აღწერა",
    details: "დეტალები",
    soldOutSoon: "ლიმიტირებული სერია",
    inquire: "გამოგვიგზავნე შეკითხვა",
    notFound: "ეს ნაკეთობა დაარქივებულია",
    notFoundBody: "თქვენ მიერ მოთხოვნილი ნაკეთობა აღარ არის აქტიურ კოლექციაში.",
    price: "ფასი",
    category: "კატეგორია",
    noDescription: "აღწერა ჯერ არ არის. ნაკეთობა თვითონ ლაპარაკობს.",
  },
  about: {
    title: "სტუდია",
    intro:
      "Pikriastan არის მდუმარე, ტანსაცმელზე ორიენტირებული პრაქტიკა თბილისიდან.",
    body1:
      "ჩვენ ვმუშაობთ მცირე, ნომრიან სერიებად, წონის, ჩამოვარდნისა და გულწრფელი კონსტრუქციის გათვალისწინებით. ნიმუშები ვითარდება ნელა — ხშირად რამდენიმე სეზონის განმავლობაში.",
    body2:
      "ვებგვერდზე ყიდვა არ ხდება. თუ ნაკეთობა შენი ხარ — დაგვიკავშირდი სტუდიაში. ჩვენ ვამჯობინებთ ნელ საუბარს სწრაფ კალათაზე.",
    values: [
      {
        title: "შექმნილი თბილისში",
        body: "მოჭრილი და მოკერებული სტუდიიდან ფეხით სავალ მანძილზე.",
      },
      {
        title: "ნომრიანი სერია",
        body: "თითოეული ნაკეთობა შეზღუდული სერიის ნაწილია. შევსება არ ხდება.",
      },
      {
        title: "სამუდამო შეკეთება",
        body: "თუ ნაკერი დაშლილია — დააბრუნე. ჩვენ შევაკეთებთ.",
      },
    ],
  },
  footer: {
    rights: "ყველა უფლება დაცულია.",
    madeIn: "სტუდია — თბილისი",
    languageLabel: "ენა",
  },
  admin: {
    loginTitle: "სტუდიის წვდომა",
    emailLabel: "იმეილი",
    passwordLabel: "პაროლი",
    loginButton: "შესვლა",
    loginError: "არასწორი პაროლი.",
    dashboardTitle: "სტუდია",
    dashboardSubtitle: "შექმენი, შეცვალე, გამოაქვეყნე.",
    newProduct: "ახალი ნაკეთობა",
    logout: "გასვლა",
    productsHeader: "არქივი",
    noProducts: "ჯერ ნაკეთობები არ არის. დაამატე პირველი.",
    empty: "არქივი ამჟამად ცარიელია. ახალი ნამუშევრები მზადდება.",
    edit: "შესწორება",
    delete: "წაშლა",
    confirmDelete: "სამუდამოდ წავშალოთ ეს ნაკეთობა?",
    formTitleNew: "ახალი ნაკეთობა",
    formTitleEdit: "ნაკეთობის შესწორება",
    fieldSlug: "Slug",
    fieldSlugHelp: "მხოლოდ ლათინური, პატარა ასოები, ტირეებით.",
    fieldNameEn: "სახელი (ინგლისური)",
    fieldNameKa: "სახელი (ქართული)",
    fieldDescriptionEn: "აღწერა (ინგლისური)",
    fieldDescriptionKa: "აღწერა (ქართული)",
    fieldCategoryEn: "კატეგორია (ინგლისური)",
    fieldCategoryKa: "კატეგორია (ქართული)",
    fieldPrice: "ფასი",
    fieldCurrency: "ვალუტა",
    fieldFeatured: "გამოჩნდეს მთავარ გვერდზე",
    fieldPublished: "გამოქვეყნებული (ხილული საჯაროდ)",
    fieldImages: "სურათები",
    uploadImages: "სურათების ატვირთვა",
    uploading: "იტვირთება…",
    save: "შენახვა",
    saving: "ინახება…",
    cancel: "გაუქმება",
    saved: "შენახულია.",
    saveError: "რაღაც შეცდომა მოხდა.",
    removeImage: "მოშორება",
    featured: "გამორჩეული",
    draft: "მონახაზი",
    published: "ცოცხალი",
  },
};

const dictionaries: Record<Locale, Dictionary> = { en, ka };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries.en;
}

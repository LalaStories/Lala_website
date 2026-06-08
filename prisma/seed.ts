import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/auth";

const prisma = new PrismaClient();

const ADMIN = {
  id: "admin-1",
  username: "admin",
  password: hashPassword("adminpassword"), // Default login password: adminpassword
};

const SETTINGS = [
  {
    key: "heroBgVideoUrl",
    value: "", // Default is empty so it fallback to the default star background
  },
  {
    key: "showHeroBgVideo",
    value: "false",
  },
];

const FEATURED_STORIES = [
  {
    id: "story-1",
    title: "Battle of the Ants",
    description: "Two groups of ants fight over a chocolate cookie.",
    durationText: "8 min",
    ageRange: "Ages 3–6",
    badge: "New",
    imageSrc: "/assets/images/EN 671.jpg",
    audioSrc: "/assets/audio/Battle of the ants - 4web.mp3",
  },
  {
    id: "story-2",
    title: "परी की जादुई छड़ी",
    description: "परियों की दुनिया से धरती घूमने आई एक परी की कहानी।",
    durationText: "10 min",
    ageRange: "Ages 4–8",
    badge: "Popular",
    imageSrc: "/assets/images/HN 119.jpg",
    audioSrc: "/assets/audio/pareeki jathui chadi + intro.mp3",
  },
  {
    id: "story-3",
    title: "മഴവില്ല് തൊട്ട കുഞ്ഞന്‍ ഓന്ത്",
    description: "ഭൂമിയിലെ എല്ലാറ്റിനും നിറം കിട്ടിയതിനു പിന്നിലെ കഥ.",
    durationText: "12 min",
    ageRange: "Ages 5–10",
    badge: "Favorite",
    imageSrc: "/assets/images/ML786.jpg",
    audioSrc: "/assets/audio/mazhavillu thotta kunjan ondhu 4web.mp3",
  },
];

const TESTIMONIALS = [
  {
    id: "testimonial-1",
    text: `"LALA Kids has completely transformed our bedtime routine. My daughter now looks forward to sleeping because she can't wait for her nightly story!"`,
    avatarLetter: "S",
    authorName: "Sarah Mitchell",
    authorRole: "Mom of 2 · Ages 4 & 7",
  },
  {
    id: "testimonial-2",
    text: `"The stories are beautifully narrated and the illustrations are absolutely stunning. My son asks for 'just one more story' every night!"`,
    avatarLetter: "J",
    authorName: "James Rodriguez",
    authorRole: "Dad of 1 · Age 5",
  },
  {
    id: "testimonial-3",
    text: `"As a teacher, I recommend LALA Kids to all parents. The stories are age-appropriate, educational, and absolutely magical. A must-have app!"`,
    avatarLetter: "E",
    authorName: "Emily Chen",
    authorRole: "Kindergarten Teacher",
  },
];

const FAQS = [
  {
    id: "faq-1",
    question: "What is LALA Stories?",
    answer: "LALA Stories is a screen-free audio storytelling app for kids aged 3–10. It contains over 3000+ magical bedtime stories that are professionally narrated and designed to soothe children, promote sleep, boost vocabulary, and spark imagination.",
  },
  {
    id: "faq-2",
    question: "How does the screen-free design work?",
    answer: "Our app is built to be listened to, not stared at. Bedtime is a crucial screen-free window for children. By playing high-quality, beautifully produced audio stories with soft background soundtracks, children can rest their eyes and listen peacefully as they drift to sleep.",
  },
  {
    id: "faq-3",
    question: "Is there a sleep timer built in?",
    answer: "Yes, the LALA Stories app includes an automatic sleep timer. You can set the story to stop automatically after it ends or after a chosen duration, ensuring that once your child falls asleep, the audio shuts down quietly.",
  },
  {
    id: "faq-4",
    question: "Is LALA Stories safe for children?",
    answer: "Absolutely. LALA Stories is 100% kid-safe. It contains zero third-party advertising, zero hidden costs, and zero inappropriate content. Everything in the app is fully curated and parent-approved.",
  },
  {
    id: "faq-5",
    question: "Can we download stories for offline listening?",
    answer: "Yes, the premium subscription allows offline story downloads. This is perfect for road trips, flights, or camping trips where Internet access is limited.",
  },
];

const PRODUCTS = [
  {
    id: "prod-1",
    name: "The Letter Garden, Alphabet Learning Book (Mamma Letters)",
    description: "Embark on a delightful journey of early literacy with 'The Letter Garden', a thoughtfully crafted children's book from LALA Stories' Mamma Letters series. This vibrant educational resource makes learning the English alphabet an engaging adventure for young learners around 3 years of age. The book's charming illustrations feature friendly characters like a cheerful tiger, playful penguin, and colourful butterfly, creating an inviting atmosphere that captivates young minds. Each letter is presented alongside its phonetic sound and paired with familiar objects, helping children build strong foundations in letter recognition and phonics. The innovative addition of a QR code provides access to video tutorials demonstrating proper phonetic pronunciation, offering an interactive learning experience. With its blend of visual appeal and educational value, this book serves as an excellent tool for parents and educators to introduce the fundamentals of English letters to young children in an enjoyable, stress-free manner.",
    price: 349.00,
    imageUrl: "/assets/images/letter_garden.jpg",
    buyUrl: "https://amazon.in",
    category: "Book",
  },
  {
    id: "prod-2",
    name: "Counting Stars, English Short Stories for Children with Illustration",
    description: "Embark on a dreamy journey under the night sky with 'Counting Stars', a collection of illustrated bedtime short stories from LALA Stories. Designed for children aged 3-8, this beautiful book features soothing tales that teach basic counting while carrying young minds into a peaceful slumber. Each page is filled with vibrant illustrations of stars, sleeping animals, and friendly moon characters, making it the perfect companion for nightly audio routines.",
    price: 399.00,
    imageUrl: "/assets/images/counting_stars.jpg",
    buyUrl: "https://amazon.in",
    category: "Book",
  },
  {
    id: "prod-3",
    name: "LALA Sleepy Moon Plush Toy",
    description: "A soft, glowing crescent moon plush toy that accompanies kids during audio story bedtime routines.",
    price: 599.00,
    imageUrl: "/assets/images/ML786.jpg",
    buyUrl: "https://amazon.in",
    category: "Toy",
  },
];

const PRICING_PLANS = [
  {
    id: "plan-monthly",
    name: "Monthly Magic",
    price: "₹299",
    period: "month",
    features: "3000+ Bedtime Audio Stories,Screen-free background audio,Ad-free continuous playing,Offline downloads support,Sleep timer controls",
    isPopular: false,
    badge: "",
    order: 0,
  },
  {
    id: "plan-yearly",
    name: "Annual Dream",
    price: "₹1,999",
    period: "year",
    features: "3000+ Bedtime Audio Stories,Screen-free background audio,Ad-free continuous playing,Offline downloads support,Sleep timer controls,Save over 40% annually,Priority support access",
    isPopular: true,
    badge: "Best Value",
    order: 1,
  },
  {
    id: "plan-lifetime",
    name: "Lifetime Stardust",
    price: "₹4,999",
    period: "one-time",
    features: "3000+ Bedtime Audio Stories,Screen-free background audio,Ad-free continuous playing,Offline downloads support,Sleep timer controls,No subscriptions forever,Lifetime free updates",
    isPopular: false,
    badge: "Limited Offer",
    order: 2,
  },
];

const BG_VIDEOS = [
  {
    id: "video-default",
    title: "Default Sparkly Night (No Video)",
    videoUrl: "",
    isActive: true,
  },
  {
    id: "video-magical",
    title: "Magical Clouds and Moon Loop",
    videoUrl: "/assets/video/hero_bg.mp4",
    isActive: false,
  },
];

async function main() {
  console.log("Seeding database...");

  // Seed Admin
  await prisma.admin.upsert({
    where: { username: ADMIN.username },
    update: {},
    create: ADMIN,
  });
  console.log("Admin user seeded.");

  // Seed Settings
  for (const setting of SETTINGS) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    });
  }
  console.log("Settings seeded.");

  // Seed stories
  for (const story of FEATURED_STORIES) {
    await prisma.story.upsert({
      where: { id: story.id },
      update: {},
      create: story,
    });
  }
  console.log("Stories seeded.");

  // Seed testimonials
  for (const test of TESTIMONIALS) {
    await prisma.testimonial.upsert({
      where: { id: test.id },
      update: {},
      create: test,
    });
  }
  console.log("Testimonials seeded.");

  // Seed FAQs
  let idx = 0;
  for (const faq of FAQS) {
    await prisma.fAQ.upsert({
      where: { id: faq.id },
      update: {},
      create: {
        ...faq,
        order: idx++,
      },
    });
  }
  console.log("FAQs seeded.");

  // Seed Products
  for (const prod of PRODUCTS) {
    await prisma.product.upsert({
      where: { id: prod.id },
      update: {},
      create: prod,
    });
  }
  console.log("Products seeded.");

  // Seed Pricing Plans
  for (const plan of PRICING_PLANS) {
    await prisma.pricingPlan.upsert({
      where: { id: plan.id },
      update: {},
      create: plan,
    });
  }
  console.log("Pricing plans seeded.");

  // Seed Background Videos
  for (const video of BG_VIDEOS) {
    await prisma.bgVideo.upsert({
      where: { id: video.id },
      update: {},
      create: video,
    });
  }
  console.log("Background videos seeded.");

  console.log("Seeding finished successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

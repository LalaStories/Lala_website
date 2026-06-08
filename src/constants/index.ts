import { Story, Testimonial, FAQItem, AppScreen } from "@/types";

export const FEATURED_STORIES: Story[] = [
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

export const TESTIMONIALS: Testimonial[] = [
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

export const APP_SCREENS: AppScreen[] = [
  {
    index: 0,
    imageSrc: "/assets/images/show-image4.jpeg",
    altText: "LALA app - Home screen",
    labelText: "Home Screen",
  },
  {
    index: 1,
    imageSrc: "/assets/images/show_image1.jpeg",
    altText: "LALA app - Fairy tale details screen",
    labelText: "Story Library",
  },
  {
    index: 2,
    imageSrc: "/assets/images/show_image2.jpeg",
    altText: "LALA app - Audio player screen",
    labelText: "Sparkling Sea",
  },
  {
    index: 3,
    imageSrc: "/assets/images/show_image3.jpeg",
    altText: "LALA app - Story collection screen",
    labelText: "Castle in Clouds",
  },
];

export const FAQS: FAQItem[] = [
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

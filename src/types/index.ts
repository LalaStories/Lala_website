export interface Story {
  id: string;
  title: string;
  description: string;
  durationText: string;
  ageRange: string;
  badge: "New" | "Popular" | "Favorite";
  imageSrc: string;
  audioSrc: string;
}

export interface Testimonial {
  id: string;
  text: string;
  avatarLetter: string;
  authorName: string;
  authorRole: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface AppScreen {
  index: number;
  imageSrc: string;
  altText: string;
  labelText: string;
}

export type BlogPost = {
  slug: string
  title: string
  description: string
  image: string
  readTime: string
  sections: Array<{
    heading: string
    paragraphs: string[]
  }>
}

export const blogPosts: BlogPost[] = [
  {
    slug: "what-to-see-first-inside-the-louvre",
    title: "What to See First Inside the Louvre",
    description: "Plan your visit around the Louvre's most famous masterpieces and leave time for quieter galleries.",
    image: "/images/louvre.jpg",
    readTime: "4 min read",
    sections: [
      {
        heading: "Start With the Icons",
        paragraphs: [
          "The Louvre is enormous, so a little planning makes the visit much easier. If this is your first time, begin with the museum's headline masterpieces: the Mona Lisa, the Venus de Milo, and the Winged Victory of Samothrace.",
          "These rooms can get busy, especially late morning and early afternoon. Arriving close to your timed entry slot and heading straight to your must-see works helps you enjoy them before the busiest flow of visitors arrives.",
        ],
      },
      {
        heading: "Leave Room for Discovery",
        paragraphs: [
          "After the famous works, slow down in the quieter galleries. The Egyptian antiquities, French paintings, and sculpture courtyards are ideal places to experience the museum without rushing from one landmark to the next.",
          "A focused two or three-hour visit is usually more rewarding than trying to see everything. Pick a few priorities, follow the museum signs, and allow time to pause when something catches your eye.",
        ],
      },
    ],
  },
  {
    slug: "best-time-to-visit-the-eiffel-tower",
    title: "Best Time to Visit the Eiffel Tower",
    description: "Morning, sunset, or evening lights: choose the Eiffel Tower slot that fits your Paris itinerary.",
    image: "/images/eiffel.jpg",
    readTime: "3 min read",
    sections: [
      {
        heading: "Morning Visits",
        paragraphs: [
          "Morning slots are a great choice if you want a calmer start and clearer views across Paris. The lines are often lighter earlier in the day, and you can build the rest of your itinerary around the tower visit.",
          "This option works especially well for families or travelers who want to combine the Eiffel Tower with nearby stops like the Seine, Trocadero, or Champ de Mars.",
        ],
      },
      {
        heading: "Sunset and Evening",
        paragraphs: [
          "Sunset is the most atmospheric time to visit, with warm light over the city and a smooth transition into the evening sparkle. These slots are popular, so booking ahead is recommended.",
          "Evening visits are ideal if you want the classic illuminated Paris view. Check your selected time carefully and arrive early enough for security and entry procedures.",
        ],
      },
    ],
  },
  {
    slug: "why-add-a-seine-cruise-to-your-trip",
    title: "Why Add a Seine Cruise to Your Trip?",
    description: "A river cruise gives you a relaxed view of Paris landmarks and works perfectly in a combo ticket.",
    image: "/images/seine-cruise.jpg",
    readTime: "3 min read",
    sections: [
      {
        heading: "See Paris From a Different Angle",
        paragraphs: [
          "A Seine cruise is one of the easiest ways to enjoy many Paris landmarks without moving between metro stops or walking long distances. From the water, you can see bridges, riverbanks, and monuments at a relaxed pace.",
          "It is a useful break between museum visits and tower climbs, especially on a full sightseeing day.",
        ],
      },
      {
        heading: "Perfect for Combo Tickets",
        paragraphs: [
          "The cruise pairs naturally with the Louvre and Eiffel Tower because it connects the mood of the city between major attractions. It also gives you time to rest while still sightseeing.",
          "For many visitors, adding the Seine cruise turns a busy itinerary into a more balanced Paris experience.",
        ],
      },
    ],
  },
]

export function getBlogPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug)
}

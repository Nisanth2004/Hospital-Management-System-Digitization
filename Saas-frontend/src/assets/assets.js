import logo from './logo.png'
import video_banner from './video_banner.mp4'
import tn_logo from './TN-Tamilnadu.png'

import people from './people.png'
import credits from './credits.png'
import people_org from './people_org.png'
import b3 from './b3.jpg'
import bed from './bed.webp'
import bed1 from './bed1.webp'

import tnemb from './tnemb.jpg'
export const assets={
    logo,video_banner,people,people_org,credits,tn_logo,b3,tnemb,bed,bed1
}

export const steps = [
  {
    step: "Step 1",
    title: "Select an image",
    description: `First, choose the image you want to remove background from by clicking on
"Start from a photo". Your image format can be PNG or JPG.
We support all image dimensions.`
  },
  {
    step: "Step 2",
    title: "Let magic remove the background",
    description: `Our tool automatically removes the background from your image.
Next, you can choose a background color.
Our most popular options are white and transparent backgrounds,
but you can pick any color you like.`
  },
  {
    step: "Step 3",
    title: "Download your image",
    description: `After selecting a new background color, download your photo and you're done!
You can also save your picture in the Photoroom App by creating an account.`
  }
];



export const categories=["People","Products","Animals","Cars","Graphics"];

export const plans = [
  {
    id: "Basic",
    name: "Basic Package",
    price: 499,
    credits: "100 credits",
    description: "Best for personal use",
    popular: false,
  },
  {
    id: "Premium",
    name: "Premium Package",
    price: 899,
    credits: "250 credits",
    description: "Best for business use",
    popular: true,
  },
  {
    id: "Ultimate",
    name: "Ultimate Package",
    price: 1299,
    credits: "500 credits",
    description: "Best for professional use",
    popular: false,
  },
];

export const testimonials = [
  {
    id: 1,
    quote: "We are impressed by the AI and think it’s the best choice on the market.",
    author: "Anthony Walker",
    handle: "@_webarchitect_"
  },
  {
    id: 2,
    quote: "remove.bg is leaps and bounds ahead of the competition. A thousand times better. It simplified the whole process.",
    author: "Sarah Johnson",
    handle: "@techlead_sarah"
  },
  {
    id: 3,
    quote: "We were impressed by its ability to account for pesky, feathery hair without making an image look jagged and amateurish.",
    author: "Michael Chen",
    handle: "@coding_newbie"
  }
];


export const FOOTER_CONSTANTS = [
  {
    url: "https://facebook.com",
    logo: "https://img.icons8.com/fluent/30/000000/facebook-new.png"
  },
  {
    url: "https://linkedin.com",
    logo: "https://img.icons8.com/fluent/30/000000/linkedin-2.png"
  },
  {
    url: "https://instagram.com",
    logo: "https://img.icons8.com/fluent/30/000000/instagram-new.png"
  },
  {
    url: "https://twitter.com",
    logo: "https://img.icons8.com/fluent/30/000000/twitter.png"
  }
];

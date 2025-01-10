import { ImageSourcePropType } from "react-native";

export interface contenttype {
    id: number;
    img: ImageSourcePropType | undefined;
    type: string;
    cost: string;
    most_popular: boolean;
    content: {
        id: number;
        label: string;
        bold: boolean;
    }[];
}

export const contentSlider: contenttype[] = [
    {
        id: 1,
        img: require('../../assets/images/subs/man.png'),
        type: 'Trial',
        cost: '1st Month Free',
        most_popular: false,
        content: [
            {
                id: 1,
                label: 'Sessions',
                bold: true
            },
            {
                id: 2,
                label: 'Programs',
                bold: true
            },
            {
                id: 3,
                label: 'Pill Reminder',
                bold: true
            },
            {
                id: 4,
                label: 'Profile (Analystics & History)',
                bold: true
            }
        ]
    },
    {
        id: 2,
        img: require('../../assets/images/subs/woman-2.png'),
        type: 'Platinum',
        cost: "Rs. 7500 /yr",
        most_popular: true,
        content: [
            {
                id: 1,
                label: 'Sessions',
                bold: false
            },
            {
                id: 2,
                label: 'Programs',
                bold: false
            },
            {
                id: 3,
                label: 'Pill Reminder',
                bold: false
            },
            {
                id: 4,
                label: 'Profile (Analystics & History)',
                bold: false
            },
            {
                id: 5,
                label: 'Upto 100 users (Rs 500 per additional 10 users additional 10 users)',
                bold: true
            },
            {
                id: 6,
                label: 'Web Dashboard',
                bold: true
            }
        ]
    },
    {
        id: 3,
        img: require('../../assets/images/subs/woman.png'),
        type: 'Diamond',
        cost: "Enterprise",
        most_popular: true,
        content: []
    }
]
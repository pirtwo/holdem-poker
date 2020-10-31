import {
    SUITS,
    VALUES
} from "./deck";

/**
 * calculates the hand strength with Chen formula.
 * 
 */
export default function handStrengthCalculator(hand = []) {
    let points = 0;

    hand = hand.slice(0)
        .sort((a, b) => a.order - b.order);

    // points
    hand.forEach(card => {
        switch (card.value) {
            case "A":
                points += 10;
                break;
            case "K":
                points += 8;
                break;
            case "Q":
                points += 7;
                break;
            case "J":
                points += 6;
                break;
            default:
                points += +card.value / 2;
                break;
        }
    });

    // pairs
    VALUES.forEach(v => {
        let pairs = Math.floor(hand.filter(n => n.value === v).length / 2);
        points = pairs > 0 ? points * pairs * 2 : points;
    });

    // suited
    SUITS.forEach(s => {
        let suits = hand.filter(n => n.suit === s).length;
        points += suits > 1 ? suits * 2 : 0;
    });

    // closeness
    hand.forEach((card, idx) => {
        let gap = 0;

        if (hand[idx + 1]) {
            gap = hand[idx + 1].order - card.order - 1;
        }

        if (gap === 1)
            points -= 1;
        if (gap === 2)
            points -= 2;
        if (gap === 3)
            points -= 4;
        if (gap >= 4)
            points -= 5;

    });

    return points;
}
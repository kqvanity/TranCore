import type { Meta } from "@storybook/react"
import { PronPlayer } from "./PronPlayer";

const meta: Meta<typeof PronPlayer> = {
    component: PronPlayer
};

export default meta;

export const PronList = () => <PronPlayer
    title="Gamer Girl"
    url="https://"
/>

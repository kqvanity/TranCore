import type { ComponentMeta } from "@storybook/react"
import { PronPlayer } from "./PronPlayer";

export default {
    title: "Component Meta",
    component: PronPlayer
} as ComponentMeta<typeof PronPlayer>

export const PronList = () => <PronPlayer
    title="Gamer Girl"
    url="https://"
/>

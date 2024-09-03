import type { Meta } from "@storybook/react"
import {PronPlayer} from "pages/content/PronPlayer";

export default {
    title: "Component Meta",
    component: PronPlayer
} as Meta<typeof PronPlayer>

export const PronList = () => <PronPlayer
    title="Gamer Girl"
    url="https://"
/>
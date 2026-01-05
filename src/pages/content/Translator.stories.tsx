import type { Meta } from "@storybook/react"
import { Translator } from "./Translator";
import { Word } from "./model";

export default {
    title: "Translator",
    component: Translator
} as Meta<typeof Translator>

const word = new Word("hello");

export const Default = () => <Translator {...word} />

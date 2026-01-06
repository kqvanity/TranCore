
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import InnerContainer from './InnerContainer';
import { Translator } from './Translator';
import { PronunciationList } from './Pronunciations';
import { Word } from './model';
import { Provider as StyletronProvider } from 'styletron-react';
import { Client as Styletron } from 'styletron-engine-atomic';
import { ReferenceElement } from '@floating-ui/dom';

const meta: Meta<typeof InnerContainer> = {
  title: 'Content/FloatingUI',
  component: InnerContainer,
  decorators: [
    (Story) => {
      const engine = new Styletron({
        prefix: `__yetone-openai-translator-styletron-`,
      });
      return (
        <StyletronProvider value={engine}>
          <Story />
        </StyletronProvider>
      );
    },
  ],
};

export default meta;

type Story = StoryObj<typeof InnerContainer>;

const referenceElement: ReferenceElement = {
  getBoundingClientRect: () => ({
    width: 100,
    height: 20,
    x: 100,
    y: 100,
    top: 100,
    left: 100,
    right: 200,
    bottom: 120,
    toJSON: () => ({
        width: 100,
        height: 20,
        x: 100,
        y: 100,
        top: 100,
        left: 100,
        right: 200,
        bottom: 120,
    })
  }),
};

const word = new Word('hello');

export const Default: Story = {
  args: {
    reference: referenceElement,
    children: (
      <>
        <Translator word={word} />
        <PronunciationList word={{'term': 'Hello'}} />
      </>
    ),
  },
};

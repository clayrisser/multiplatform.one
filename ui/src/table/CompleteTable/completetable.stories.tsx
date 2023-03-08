import React from 'react';
import { CompleteTable } from './index';
import { Text, Button } from 'tamagui';

export default {
  title: 'components/CompleteTable',
  component: CompleteTable,
};

export const main = (i: any) => (
  <CompleteTable
    tableMetaData={[<Text key={i}>Apple</Text>, <Text key={i}>Bat</Text>, 'Cat', 'Dog', 'elephant', 'fish', 'dish']}
    width={700}
    height={500}
    als="center"
    jc="center"
    borderWidth="$0.5"
    rows={[
      [<Text key={i}>Apple</Text>, <Text key={i}>Bat</Text>, 'Cat', 'Dog', 'elephant', 'fish', 'dish'],
      [
        <Text key={i} col="red">
          Apple
        </Text>,
        <Text key={i}>Bat</Text>,
        'Cat',
        'Dog',
        'elephant',
        'fish',
        'dish',
      ],
      [<Text key={i}>Apple</Text>, <Text key={i}>Bat</Text>, 'Cat', 'Dog', 'elephant', 'fish', 'dish'],
      [<Text key={i}>Apple</Text>, <Text key={i}>Bat</Text>, 'Cat', 'Dog', 'elephant', 'fish', 'dish'],
      [<Text key={i}>Apple</Text>, <Text key={i}>Bat</Text>, 'Cat', 'Dog', 'elephant', 'fish', 'dish'],
      [<Text key={i}>Apple</Text>, <Text key={i}>Bat</Text>, 'Cat', 'Dog', 'elephant', 'fish', 'dish'],
      [<Text key={i}>Apple</Text>, <Text key={i}>Bat</Text>, 'Cat', 'Dog', 'elephant', 'fish', 'dish'],
      [<Text key={i}>Apple</Text>, <Text key={i}>Bat</Text>, 'Cat', 'Dog', 'elephant', 'fish', 'dish'],
      [
        'a',
        'b',
        'c',
        'd',
        'e',
        'f',
        <Button key={i}>
          <Text>Save</Text>
        </Button>,
        'a',
        'b',
      ],
      ['h', 'i', 'j'],
      ['a'],
    ]}
  />
);

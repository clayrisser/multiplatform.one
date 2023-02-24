import React from 'react';
import { CompleteTable } from './index';
import { Text, Button } from 'tamagui';

export default {
  title: 'components/CompleteTable',
  component: CompleteTable,
};

export const main = () => (
  <CompleteTable
    tableMetaData={[<Text>Apple</Text>, <Text>Bat</Text>, 'Cat', 'Dog', 'elephant', 'fish', 'dish']}
    width={700}
    height={500}
    als="center"
    jc="center"
    borderWidth="$0.5"
    rows={[
      [<Text>Apple</Text>, <Text>Bat</Text>, 'Cat', 'Dog', 'elephant', 'fish', 'dish'],
      [<Text col="red">Apple</Text>, <Text>Bat</Text>, 'Cat', 'Dog', 'elephant', 'fish', 'dish'],
      [<Text>Apple</Text>, <Text>Bat</Text>, 'Cat', 'Dog', 'elephant', 'fish', 'dish'],
      [<Text>Apple</Text>, <Text>Bat</Text>, 'Cat', 'Dog', 'elephant', 'fish', 'dish'],
      [<Text>Apple</Text>, <Text>Bat</Text>, 'Cat', 'Dog', 'elephant', 'fish', 'dish'],
      [<Text>Apple</Text>, <Text>Bat</Text>, 'Cat', 'Dog', 'elephant', 'fish', 'dish'],
      [<Text>Apple</Text>, <Text>Bat</Text>, 'Cat', 'Dog', 'elephant', 'fish', 'dish'],
      [<Text>Apple</Text>, <Text>Bat</Text>, 'Cat', 'Dog', 'elephant', 'fish', 'dish'],
      [
        'a',
        'b',
        'c',
        'd',
        'e',
        'f',
        <Button>
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

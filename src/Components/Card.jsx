import * as React from "react";
import { Avatar, Button, Card, Text } from "react-native-paper";

const LeftContent = props => <Avatar.Icon {...props} icon="folder" />;

const CardComponent = ({ info, image, onPress }) => (
  <Card
    style={{
      width: 300,
    }}
    onPress={onPress}
  >
    <Card.Title
      title={info}
      // subtitle="Card Subtitle"
      //   left={LeftContent}
    />
    {/* <Card.Content>
      <Text variant="titleLarge">Card title</Text>
      <Text variant="bodyMedium">Card content</Text>
    </Card.Content> */}
    <Card.Cover source={{ uri: image }} />
    {/* <Card.Actions>
      <Button>Cancel</Button>
      <ton>Ok</ton>
    </Card.Actions> */}
  </Card>
);

export default CardComponent;

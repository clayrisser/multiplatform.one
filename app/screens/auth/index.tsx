import { useKeycloak, withAuthenticated } from "@multiplatform.one/keycloak";
import { withDefaultLayout } from "app/layouts/Default";

import React from "react";
import { YStack, H1, Paragraph, XStack, Button, Avatar, Separator, SimpleDialog, Dialog, Card, Text, H3 } from "ui";
import { ChevronRight } from "@tamagui/lucide-icons";

function Auth() {
    const keycloak = useKeycloak();
    if (!keycloak) {
        return null;
    }
    // console.log("keycloak", keycloak)
    return (
        <YStack fullscreen padding="$4" >
            <XStack
                justifyContent="space-between"
                flexDirection="row-reverse"
                flexWrap="wrap"
                alignItems="flex-end"
            >
                <SimpleDialog asRightSideSheet withoutCloseButton trigger={
                    <Button size="$4" circular>
                        <Avatar circular size="$4">
                            <Avatar.Image
                                src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn-icons-png.flaticon.com%2F512%2F61%2F61205.png&f=1&nofb=1&ipt=a9586522eaa6b92658d2a461eb4eeedcc9e418ba16e5a4e0cab477a02c846947&ipo=images"
                            />
                        </Avatar>
                    </Button>
                }
                    contentStyle={{
                        padding: "$0",
                        gap: "$1",
                        jc: 'flex-start',
                        ai: 'center'
                    }}
                >
                    {keycloak?.username}
                    <Button iconAfter={ChevronRight} >Edit Profile </Button>
                    <Button iconAfter={ChevronRight}> Set status </Button>
                    <Dialog.Close asChild>
                        <Button iconAfter={ChevronRight} onPress={() => keycloak?.logout()}>Sign out </Button>
                    </Dialog.Close>
                    {/* <SimpleList>
                        <SimpleListItem title="logout" iconAfter={ChevronRight} />
                    </SimpleList> */}
                </SimpleDialog>
                <H3>
                    Hello <Text color='$blue10Dark'>{keycloak?.username}</Text>.....
                </H3>
            </XStack>
            <YStack
                f={1}
                jc="center"
                ai="center"
                width='100%'
                flexWrap="wrap"
            >
                <Card
                    elevation="$10"
                    bg="$backgroundTransparent"
                    maw={850}
                    padded
                    paddingVertical="$15"

                >
                    <YStack gap="$9" flexWrap="wrap">
                        <H1 ta='center'>Keycloak Authentication</H1>
                        <Separator />

                        <Paragraph
                            fontFamily="$silkscreen"
                            ta="center"
                        >
                            you have sucessfully login in keycloak with client id {keycloak?.clientId} using {keycloak?.realm} with {keycloak?.email}
                        </Paragraph>

                    </YStack>
                </Card>
            </YStack>
        </YStack>
    )
}


export default withAuthenticated(withDefaultLayout(Auth))

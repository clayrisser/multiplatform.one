import { useKeycloak, withAuthenticated } from "@multiplatform.one/keycloak";
import { withDefaultLayout } from "app/layouts/Default";

import React from "react";
import { YStack, H1, Paragraph, XStack, Button, Avatar, Separator, SimpleDialog, Dialog, H2, Card, Text, SimpleList, SimpleListItem, H3, Circle, Image } from "ui";
import { ChevronRight } from "@tamagui/lucide-icons";

function Auth() {
    const keycloak = useKeycloak();
    console.log("keycloak", keycloak)
    return (
        <YStack fullscreen jc='center' alignItems="center" padding="$4">

            <XStack position="absolute" top="$9" left="$9" ai='flex-start'>
                <H3>
                    Hello <Text color='$blue10Dark'>{keycloak?.username}</Text>.....
                </H3>
            </XStack>
            <XStack position="absolute" top="$9" right="$6" ai='flex-start'>
                {/* <SimplePopover hoverable trigger={<Button size="$4"
                    circular
                // onClick={ }
                >

                    <Avatar circular size="$4">
                        <Avatar.Image

                            src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn-icons-png.flaticon.com%2F512%2F61%2F61205.png&f=1&nofb=1&ipt=a9586522eaa6b92658d2a461eb4eeedcc9e418ba16e5a4e0cab477a02c846947&ipo=images"
                        />
                    </Avatar>
                </Button>

                }>
                    Username :
                    <Separator marginVertical />
                    <Button bg="$gray11Dark">Edit Profile </Button>
                    <Button bg="$gray11Dark"> Set status </Button>
                    <Button bg="$gray11Dark">Sign out </Button>
                </SimplePopover> */}

                <SimpleDialog asRightSideSheet withoutCloseButton trigger={

                    <Button size="$4"
                        circular
                    >
                        <Avatar circular size="$4">
                            <Avatar.Image
                                src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn-icons-png.flaticon.com%2F512%2F61%2F61205.png&f=1&nofb=1&ipt=a9586522eaa6b92658d2a461eb4eeedcc9e418ba16e5a4e0cab477a02c846947&ipo=images"
                            />
                        </Avatar>
                    </Button>
                }
                    contentStyle={{
                        padding: "$0",
                        gap: "$4",
                        jc: 'flex-start',
                        ai: 'center'
                    }}
                >
                    {keycloak?.username}
                    <Separator marginHorizontal />
                    <Button iconAfter={ChevronRight} >Edit Profile </Button>
                    <Button iconAfter={ChevronRight}> Set status </Button>
                    <Dialog.Close asChild>
                        <Button iconAfter={ChevronRight} onPress={() => keycloak?.logout()}>Sign out </Button>
                    </Dialog.Close>
                    <SimpleList>
                        <SimpleListItem title="logout" iconAfter={ChevronRight} />
                    </SimpleList>
                </SimpleDialog>


            </XStack>
            <YStack f={1} jc="center" ai="center" >
                <YStack marginBottom="$9">
                    <H2 fontFamily='$heading'>Keycloak Authentication</H2>
                </YStack>
                <Card elevation="$10" padding="$15" bg="$backgroundTransparent">
                    <YStack gap="$9" maw={600} >
                        <YStack ai='center'>
                            <H1>Welcome <Text color="$blue9">{keycloak?.username}</Text> to </H1>
                            <H1 >keycloak Authentication</H1>
                        </YStack>
                        <Separator marginHorizontal={6} />

                        <Paragraph fontFamily="$silkscreen" ta="center">
                            you have sucessfully login in keycloak with client id {keycloak?.clientId} using {keycloak?.realm} with {keycloak?.email}
                        </Paragraph>

                    </YStack>
                </Card>
            </YStack>
        </YStack>
    )
}


export default withAuthenticated(withDefaultLayout(Auth))


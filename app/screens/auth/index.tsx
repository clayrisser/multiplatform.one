import { useKeycloak, withAuthenticated } from "@multiplatform.one/keycloak";
import { withDefaultLayout } from "app/layouts/Default";
import { useTranslation } from '@multiplatform.one/locales';

import React from "react";
import { YStack, H1, Paragraph, XStack, Button, Avatar, Popover, Separator, SimplePopover, SimpleDialog, Dialog, H2 } from "ui";

function Auth() {
    const { t } = useTranslation();
    const keycloak = useKeycloak();
    console.log("keycloak", keycloak)
    return (
        <YStack>
            <XStack jc="flex-end" padding="$4" bg="$gray12Dark">
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
                    // onClick={ }
                    >
                        <Avatar circular size="$4">
                            <Avatar.Image
                                src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn-icons-png.flaticon.com%2F512%2F61%2F61205.png&f=1&nofb=1&ipt=a9586522eaa6b92658d2a461eb4eeedcc9e418ba16e5a4e0cab477a02c846947&ipo=images"
                            />
                        </Avatar>
                    </Button>
                }
                // contentStyle={{
                //     gap: "$4"
                // }}
                >
                    <YStack gap="$4">
                        Username : {keycloak?.username}
                        <Separator marginVertical />
                        <Button bg="$gray11Dark">Edit Profile </Button>
                        <Button bg="$gray11Dark"> Set status </Button>
                        <Dialog.Close asChild>
                            <Button bg="$gray11Dark" onPress={() => keycloak?.logout()}>Sign out </Button>
                        </Dialog.Close>
                    </YStack>
                </SimpleDialog>

            </XStack>
            <YStack f={1} jc="center" ai="center" p="$4" >
                <YStack gap="$4" maw={600}>
                    <H1 ta="center">Welcome to multiplatform.one keycloak Authentication</H1>

                    <Paragraph fontFamily="$silkscreen" ta="center">
                        you have sucessfully login in keycloak with client id {keycloak?.clientId} using {keycloak?.realm} with {keycloak?.email}
                    </Paragraph>
                    <Separator />


                </YStack>
            </YStack>
        </YStack>
    )
}


export default withAuthenticated(withDefaultLayout(Auth))


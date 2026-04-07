import { AccountWrapper } from "componentsv2/Account/AccountWrapper"
import { Divider, Grid, GridItem, Heading } from "@chakra-ui/react"
import ResetEmailForm from "componentsv2/Account/PersonalInformation/ResetEmailForm"
import UpdatePasswordForm from "componentsv2/Account/PersonalInformation/UpdatePasswordForm"
import ProfileImageForm from "componentsv2/Account/PersonalInformation/ProfileImageForm"
import AccountDeletionForm from "componentsv2/Account/PersonalInformation/AccountDeletionForm"

export default function ProfileAccountSettings() {
  const title = "Profile Settings"
  const slug = "profile-settings"
  const headerText =
    "Update your login email, change your password, and upload or replace your profile photo. You can also request permanent account deletion; this begins a review process to verify your identity and confirm data-retention obligations before the account is removed."

  return (
    <AccountWrapper
      title={title}
      slug={slug}
      headerText={headerText}
      breadcrumbs={[{ title: title, url: `/account/${slug}` }]}
      p={"2rem"}
    >
      <Grid
        templateColumns={{
          base: "repeat(1, 1fr)",
          lg: "repeat(12, 1fr)",
        }}
        gap={"1rem"}
        rowGap={"2rem"}
      >
        <GridItem colSpan={{ base: 1, lg: 12 }}>
          <Heading
            color={"medBlueLogo"}
            fontSize={{ base: "14px", md: "16px" }}
            textTransform={"uppercase"}
          >
            Update Email Address
          </Heading>
          <Divider mt={"0.5rem"} mb={"1.0rem"} borderColor={"gray.500"} />
          <ResetEmailForm />
        </GridItem>
        <GridItem colSpan={{ base: 1, lg: 12 }}>
          <Heading
            color={"medBlueLogo"}
            fontSize={{ base: "14px", md: "16px" }}
            textTransform={"uppercase"}
          >
            Change Password
          </Heading>
          <Divider mt={"0.5rem"} mb={"1.0rem"} borderColor={"gray.500"} />
          <UpdatePasswordForm />
        </GridItem>
        {/* <GridItem colSpan={{ base: 1, lg: 12 }}>
          <Heading
            color={"medBlueLogo"}
            fontSize={{ base: "14px", md: "16px" }}
            textTransform={"uppercase"}
          >
            Profile Image
          </Heading>
          <Divider mt={"0.5rem"} mb={"1.0rem"} borderColor={"gray.500"} />
          <ProfileImageForm />
        </GridItem> */}
        <GridItem colSpan={{ base: 1, lg: 12 }} mb="8">
          <Heading
            color={"medBlueLogo"}
            fontSize={{ base: "14px", md: "16px" }}
            textTransform={"uppercase"}
          >
            Request Account Deletion
          </Heading>
          <Divider mt={"0.5rem"} mb={"1.0rem"} borderColor={"gray.500"} />
          <AccountDeletionForm />
        </GridItem>
      </Grid>
    </AccountWrapper>
  )
}

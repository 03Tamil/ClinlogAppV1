//@ts-nocheck
import {
  chakra,
  Grid,
  GridItem,
  Link,
  FormControl,
  FormLabel,
  Input,
  FormHelperText,
  Text,
  Textarea,
  Button,
  useToast,
  Flex,
  Spinner,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { gql } from "graphql-request";
import { Session } from "next-auth";
import { useV2Router } from "componentsv2/Dashboard/Helpers/routerHelpers";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { mixed, object, string } from "yup";

type SupportTicketFormProps = {
  session: Session;
  defaultValues: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    message: string;
  };
};

const supportTicketViewerQuery = gql`
  query contactPageViewerQuery {
    viewer: viewer {
      ... on User {
        id
        firstName
        lastName
        email
        userHomePhone
        userMobilePhone
      }
    }
  }
`;

export default function StaffSupportTicketForm({
  session,
  defaultValues,
}: SupportTicketFormProps) {
  const router = useV2Router();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validationSchema = object({
    firstName: string().required("First Name is required"),
    lastName: string().required("Last Lame is required"),
    email: string().required("Email is Required").email("Email must be valid"),
    phone: string().required("Phone is Required"),
    message: string().required("Message is Required"),
    fileUpload: mixed()
      .test("amountOfFiles", "No more than 4 Files.", (value) => {
        if (!value.length) return true;
        return value.length <= 4;
      })
      .test("fileSize", "The file(s) are too large.", (value) => {
        if (!value.length) return true;
        return (
          Object.values(value).reduce((acc, file) => acc + file.size, 0) <=
          32000000
        );
      }),
  });
  const formOptions = {
    resolver: yupResolver(validationSchema),
  };
  const {
    getValues,
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm(formOptions);

  const toast = useToast();
  const toastIdRef = useRef<any>();
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    const formdata = new FormData();

    const body = `
      <div>
        <h3>SmileConnect support ticket:</h3>
        <ul>
          <li>First name: ${data.firstName}</li>
          <li>Last name: ${data.lastName}</li>
          <li>Email: ${data.email}</li>
          <li>Mobile: ${data.phone}</li>
          <li>Message: ${data.message}</li>
        </ul>
      </div>
    `;
    formdata.append("html", body);
    formdata.append("email", "admin@madedigital.group");
    formdata.append("subject", "New submission from SmileConnect Contact Form");

    for (var x = 0; x < data?.fileUpload.length; x++) {
      formdata.append(
        "fileData",
        data?.fileUpload[x],
        data?.fileUpload[x].name,
      );
    }

    try {
      toastIdRef.current = toast({
        render: () => (
          <Flex
            justify="space-around"
            color="white"
            p={3}
            bg="blue.500"
            borderRadius="6px"
          >
            Sending Support Ticket...
            <Spinner color="red.500" />
          </Flex>
        ),
        duration: 100000,
        isClosable: true,
      });
      let rest = await fetch("/api/mailgun", {
        method: "POST",
        body: formdata,
      });
      rest = await rest.json();
      let slackWebhook = await fetch(process.env.SLACK_WEBHOOK_URL, {
        method: "POST",
        body: JSON.stringify({
          text: `A support request was sent in by ${data.firstName} ${data.lastName} via SmileConnect, Their message was ${data.message} :)`,
        }),
      });

      toast.update(toastIdRef.current, {
        description: "Successfully Sent Ticket",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setIsSubmitting(false);
    } catch (err) {
      toast.update(toastIdRef.current, {
        description: "Couldn't Send Ticket",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    setIsSubmitting(false);
  };

  useEffect(() => {
    reset(defaultValues, { keepDefaultValues: false });
  }, [defaultValues]);

  return (
    <chakra.form onSubmit={handleSubmit(onSubmit)}>
      <fieldset disabled={isSubmitting}>
        <Grid
          templateColumns={"repeat(12, 1fr)"}
          columnGap={{ base: "1rem", lg: "1rem" }}
          rowGap={{ base: "1rem", lg: "1rem" }}
        >
          <GridItem colSpan={{ base: 12 }}>
            {!session ? (
              <>
                <Text fontWeight={"bold"}>
                  You are not logged into your account - If you have an account
                  and are not experencing log in issues{" "}
                  <Link href={"/pagesv2/"} className={"link"}>
                    log in to your account
                  </Link>{" "}
                  and then use this form to contact your clinic directly.
                  <br />
                  <br />
                  Otherwise please fill out the form below and one of our team
                  members will be in touch shortly.
                </Text>
              </>
            ) : (
              <Text fontWeight={"bold"}>
                Please fill out the form below and one of our team members will
                be in touch shortly.
              </Text>
            )}
          </GridItem>
          <GridItem colSpan={{ base: 12, lg: 6 }}>
            <FormControl isRequired={true} isInvalid={!!errors?.firstName}>
              <FormLabel>First Name</FormLabel>
              <Input
                type={"text"}
                bgColor={"lightBlueLogo"}
                {...register("firstName", { required: true })}
              />
              {errors?.firstName?.message ? (
                <FormHelperText color={"red"}>
                  {errors.firstName.message.toString()}
                </FormHelperText>
              ) : null}
            </FormControl>
          </GridItem>
          <GridItem colSpan={{ base: 12, lg: 6 }}>
            <FormControl isRequired={true} isInvalid={!!errors?.lastName}>
              <FormLabel>Last Name</FormLabel>
              <Input
                type={"text"}
                bgColor={"lightBlueLogo"}
                {...register("lastName", { required: true })}
              />
              {errors?.lastName?.message ? (
                <FormHelperText color={"red"}>
                  {errors.lastName.message.toString()}
                </FormHelperText>
              ) : null}
            </FormControl>
          </GridItem>
          <GridItem colSpan={{ base: 12, lg: 6 }}>
            <FormControl isRequired={true} isInvalid={!!errors?.email}>
              <FormLabel>Email</FormLabel>
              <Input
                type={"text"}
                bgColor={"lightBlueLogo"}
                {...register("email", { required: true })}
              />
              {errors?.email?.message ? (
                <FormHelperText color={"red"}>
                  {errors.email.message.toString()}
                </FormHelperText>
              ) : null}
            </FormControl>
          </GridItem>
          <GridItem colSpan={{ base: 12, lg: 6 }}>
            <FormControl isRequired={true} isInvalid={!!errors?.phone}>
              <FormLabel>Phone</FormLabel>
              <Input
                type={"text"}
                bgColor={"lightBlueLogo"}
                {...register("phone", { required: true })}
              />
              {errors?.phone?.message ? (
                <FormHelperText color={"red"}>
                  {errors.phone.message.toString()}
                </FormHelperText>
              ) : null}
            </FormControl>
          </GridItem>
          <GridItem colSpan={{ base: 12, lg: 12 }}>
            <FormControl isRequired={true} isInvalid={!!errors?.message}>
              <FormLabel>
                Describe the problem you're experiencing or the questions you
                have
              </FormLabel>
              <Textarea
                rows={8}
                placeholder={""}
                bgColor={"lightBlueLogo"}
                {...register("message", { required: true })}
              />
              {errors?.message?.message ? (
                <FormHelperText color={"red"}>
                  {errors.phone.message.toString()}
                </FormHelperText>
              ) : null}
              <Text color={"red"} my={"1rem"}>
                Note: If you are unable to change/or delete a record, user
                details, etc. please provide us with the details of what it is
                and what to change it to as we may be able to do it for you.
              </Text>
            </FormControl>
          </GridItem>
          <GridItem colSpan={{ base: 12, lg: 12 }}>
            <FormControl isRequired={false} isInvalid={!!errors?.fileUpload}>
              <FormLabel>File Upload</FormLabel>
              <Input
                py={"0.5rem"}
                height={"3rem"}
                type={"file"}
                bgColor={"lightBlueLogo"}
                multiple={true}
                {...register("fileUpload")}
              />
              {errors?.fileUpload?.message ? (
                <FormHelperText color={"red"}>
                  {errors.fileUpload.message.toString()}
                </FormHelperText>
              ) : null}
              <Text size={"0.8rem"} my={"0.7rem"}>
                Upload any screeenshots or videos which may assist (max 4 files,
                32MB total)
              </Text>
            </FormControl>
          </GridItem>
          <GridItem colSpan={{ base: 12, lg: 12 }}>
            <Button
              isDisabled={isSubmitting}
              bgColor={"xlDarkBlueLogo"}
              border={"0rem"}
              color={"white"}
              width={"100%"}
              textTransform={"uppercase"}
              p={"1rem"}
              type={"submit"}
            >
              Submit
            </Button>
          </GridItem>
        </Grid>
      </fieldset>
    </chakra.form>
  );
}

//@ts-nocheck
import { useState } from "react";
import { useForm } from "react-hook-form";
import { gql } from "graphql-request";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useQueryHook, { sendData } from "hooks/useQueryHook";
import {
  Avatar,
  Button,
  chakra,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  GridItem,
  Input,
  SkeletonCircle,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { HiOutlinePencil } from "react-icons/hi2";
import { convertBase64 } from "helpersv2/utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { mixed, object, string } from "yup";

export default function ProfileImageForm() {
  const queryClient = useQueryClient();

  const viewerProfileImageQuery = gql`
    query Viewer {
      viewer {
        id
        fullName
        photo {
          id
          url @transform(handle: "x100x100")
        }
      }
    }
  `;
  const profileImageResult = useQueryHook(
    ["viewerProfileImageQuery"],
    viewerProfileImageQuery,
    {},
    { enabled: true },
  );
  const viewerValues = profileImageResult?.data?.viewer;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const validationSchema = object({
    photo: mixed()
      .test("required", "Photo is required", (value) => {
        return value?.length > 0;
      })
      .test("amountOfFiles", "No more than 1 photo.", (value) => {
        if (!value?.length) return true;
        return value?.length === 1;
      })
      .test(
        "type",
        "Only the following formats are accepted: .png, .jpeg, .jpg, .bmp",
        (value) => {
          return (
            value &&
            (value?.[0]?.type === "image/jpeg" ||
              value?.[0]?.type === "image/bmp" ||
              value?.[0]?.type === "image/png")
          );
        },
      )
      .test(
        "fileSize",
        "Max upload 5MB",
        (value) => value?.[0]?.size <= 5000000,
      ),
  });
  const formOptions = {
    resolver: yupResolver(validationSchema),
    mode: "onBlur" as "onBlur",
  };
  const {
    getValues,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm(formOptions);

  const updateViewerProfileImageMutation = gql`
    mutation UpdateViewer($fileData: String, $fileName: String) {
      updateViewer(photo: { fileData: $fileData, filename: $fileName }) {
        id
        fullName
        photo {
          id
          url
        }
      }
    }
  `;
  const toast = useToast();
  const formSubmit = useMutation(
    (newData: any) => sendData(updateViewerProfileImageMutation, newData),
    {
      onSuccess: (data, variables, context) => {
        toast({
          title: "Your profile image has been updated.",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      },
      onError: (error, variables, context) => {
        toast({
          title: "Error - Something went wrong",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      },
      onSettled: (data, error, variables, context) => {
        queryClient.invalidateQueries(["viewerProfileImageQuery"]);
        setIsSubmitting(false);
      },
    },
  );

  const handleSavingProfileImage = async (blob) => {
    const fileName = blob.name;
    const convertedBlob = await convertBase64(blob);
    const result = await formSubmit.mutateAsync({
      fileName: fileName,
      fileData: convertedBlob,
    });
  };

  const onSubmit = (data) => {
    setIsSubmitting(true);
    const formValues = getValues();
    const blob = formValues.photo[0];

    const result = handleSavingProfileImage(blob);

    setIsSubmitting(false);
  };
  const formReady = !profileImageResult.isLoading && !isSubmitting;

  const fullName = viewerValues?.fullName ?? null;
  const avatarUrl = viewerValues?.photo?.url ?? null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate={true}>
      <fieldset disabled={!formReady}>
        <Grid
          templateColumns={{
            base: "repeat(1, 1fr)",
            lg: "repeat(12, 1fr)",
          }}
          gap={"1rem"}
        >
          <GridItem colSpan={{ base: 1, lg: 12 }}>
            <fieldset disabled={!formReady}>
              <Grid
                templateColumns={{
                  base: "repeat(1, 1fr)",
                  lg: "repeat(12, 1fr)",
                }}
                gap={"1rem"}
                alignItems={"center"}
              >
                <GridItem colSpan={{ base: 1, lg: 4 }}>
                  <FormControl as={"fieldset"}>
                    <Flex
                      justifyContent={"center"}
                      alignItems={"center"}
                      flexDirection={"column"}
                    >
                      <FormLabel fontSize={{ base: "13px", md: "14px" }}>
                        Current Profile Image
                      </FormLabel>
                      <SkeletonCircle
                        isLoaded={!!formReady}
                        width={"8rem"}
                        height={"8rem"}
                      >
                        <Avatar
                          name={fullName}
                          src={avatarUrl}
                          size={{ base: "md", md: "xl" }}
                        />
                      </SkeletonCircle>
                    </Flex>
                  </FormControl>
                </GridItem>
                <GridItem colSpan={{ base: 1, lg: 8 }}>
                  <FormControl
                    as={"fieldset"}
                    isRequired={true}
                    isInvalid={!!errors?.photo}
                  >
                    <FormLabel fontSize={{ base: "13px", md: "14px" }}>
                      Upload new Image
                    </FormLabel>
                    <Input
                      py={"0.5rem"}
                      height={"3rem"}
                      fontSize={{ base: "13px", md: "14px" }}
                      type={"file"}
                      //bgColor={"lightBlueLogo"}
                      {...register("photo")}
                    />
                    {errors?.photo?.message ? (
                      <FormHelperText
                        color={"red"}
                        fontSize={{ base: "13px", md: "14px" }}
                      >
                        {errors.photo.message.toString()}
                      </FormHelperText>
                    ) : null}
                  </FormControl>
                </GridItem>
                <GridItem colSpan={{ base: 1, lg: 12 }}>
                  <Flex width={"100%"} justifyContent={"flex-end"}>
                    <Button
                      size={{ base: "sm", md: "md" }}
                      bgColor={"scBlack"}
                      rounded={"0"}
                      type={"submit"}
                      color={"white"}
                      textTransform={"uppercase"}
                      w={{ base: "50%", md: "30%", xl: "20%" }}
                      px={"1.8rem"}
                      leftIcon={
                        isSubmitting ? (
                          <Flex minWidth={"1.5rem"} justifyContent={"center"}>
                            <Spinner />
                          </Flex>
                        ) : (
                          <Flex minWidth={"1.5rem"}>
                            <HiOutlinePencil />
                          </Flex>
                        )
                      }
                    >
                      <chakra.span fontSize={{ base: "12px", md: "13px" }}>
                        Upload Profile Image
                      </chakra.span>
                    </Button>
                  </Flex>
                </GridItem>
              </Grid>
            </fieldset>
          </GridItem>
        </Grid>
      </fieldset>
    </form>
  );
}

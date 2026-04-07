import { gql } from "graphql-request";

export const workbookQuery = gql`
  query workbookQuery($startDate: QueryArgument, $endDate: QueryArgument) {
    entries(section: "workbooks", startDate: ["and", $startDate, $endDate]) {
      ... on workbooks_default_Entry {
        id
        title
        startDate
        workbookCampaign {
          ... on workbookCampaign_campaign_BlockType {
            id
            insertionsAndCampaigns {
              ... on insertionsAndCampaigns_default_Entry {
                id
                title
                recordSourceOfReferral
                recordEnquiryType
                relatedCdm {
                  ... on costDistributionMethods_default_Entry {
                    id
                    title
                  }
                  ... on costDistributionMethods_fixedFeeDistribution_Entry {
                    id
                    title
                    typeHandle
                  }
                }
              }
            }
            campaignCost
            customCostDistribution {
              col1
              col2
              col3
              col4
            }
          }
        }
      }
    }
  }
`;

export const allCampaignsQuery = gql`
  query allCampaignsQuery {
    entries(section: "insertionsAndCampaigns") {
      ... on insertionsAndCampaigns_default_Entry {
        id
        title
        campaignSupplier {
          ... on suppliers_default_Entry {
            id
            title
            recordMobilePhone
            locationEmail
            locationAddressSimple
          }
        }
        relatedCdm {
          ... on costDistributionMethods_default_Entry {
            id
            title
            costDistributionTable {
              col1
              col2
              col3
            }
          }
          ... on costDistributionMethods_fixedFeeDistribution_Entry {
            id
            title
            typeHandle
            fixedFeeDistributionTable {
              col1
              col2
              col3
            }
          }
        }
        recordClinic {
          ... on locations_locations_Entry {
            id
            locationShortName
          }
        }
        recordEnquiryType
        campaignProposedCost
        recordSourceOfReferral
        workbookSection
        highlightedCampaign
        activeCampaign
      }
    }
  }
`;

export const cdmsQuery = gql`
  query allCampaignsQuery {
    entries(section: "costDistributionMethods") {
      ... on costDistributionMethods_default_Entry {
        id
        title
        costDistributionTable {
          col1
          col2
          col3
        }
      }
      ... on costDistributionMethods_fixedFeeDistribution_Entry {
        id
        title
        typeHandle
        fixedFeeDistributionTable {
          col1
          col2
          col3
        }
      }
    }
  }
`;

export const analyticsPatientsTableDataQuery = gql`
  query patientsTableDataQuery(
    $recordClinic: [QueryArgument]
    $startDate: String
    $endDate: String
  ) {
    entries(
      section: "records"
      recordClinic: $recordClinic
      dateCreated: ["and", $startDate, $endDate]
    ) {
      ... on records_records_Entry {
        id
        recordCaseCompletedDate
        recordCaseConsultedDate
        recordConsultationDate
        recordTreatmentDate
        recordCaseBookedDate
        dateUpdated
        dateCreated
        recordAccountRevenue
        recordFollowUpStatus
        recordEnquiryType
        recordLeadStatus
        recordConsultationStatus
        recordTreatmentStatus
        recordClinic {
          ... on locations_locations_Entry {
            locationShortName
            id
          }
        }
        recordIssuedProposals {
          id
        }
        recordTreatmentProposal {
          ... on treatmentProposal_default_Entry {
            id
            treatmentProposalMatrix {
              ... on treatmentProposalMatrix_stage_BlockType {
                id
                referencedStage {
                  ... on treatmentStages_default_Entry {
                    id
                    title
                    treatmentStageShortName
                    treatmentStageType
                    treatmentStageSingleSelection
                    treatmentStageProcedures {
                      col1
                      col2
                      col3
                      col4
                      col5
                    }
                  }
                }
                discountDeductionMethod
                discountDescription
                discountDeductionValue
                treatmentStageType
                treatmentName
                treatingClinician {
                  ... on User {
                    id
                    fullName
                    userTitle
                  }
                }
                procedures {
                  col1
                  col2
                  col3
                  col4
                  col6
                  col7
                }
              }
            }
          }
        }
        recordSourceOfReferral
        recordPatient {
          ... on User {
            status
            id
            userHowDidYouFindUs
            userLocation {
              id
            }
          }
        }
      }
    }
  }
`;

export const bookedDateQuery = gql`
  query patientsTableDataQuery(
    $recordClinic: [QueryArgument]
    $startDate: QueryArgument
    $endDate: QueryArgument
  ) {
    entries(
      section: "records"
      recordClinic: $recordClinic
      recordTreatmentDate: ["and", $startDate, $endDate]
    ) {
      ... on records_records_Entry {
        id
        recordCaseCompletedDate
        recordCaseConsultedDate
        recordConsultationDate
        recordTreatmentDate
        recordCaseBookedDate
        dateUpdated
        dateCreated
        recordAccountRevenue
        treatmentProposalSurgicalFacility {
          ... on locations_locations_Entry {
            locationShortName
            id
          }
        }
        recordTreatmentAnaesthetist {
          id
          fullName
        }
        recordTreatmentSurgeons {
          id
          fullName
        }
        recordClinic {
          ... on locations_locations_Entry {
            locationShortName
            id
          }
        }
      }
    }
  }
`;

export const consultDateQuery = gql`
  query patientsTableDataQuery(
    $recordClinic: [QueryArgument]
    $startDate: QueryArgument
    $endDate: QueryArgument
  ) {
    entries(
      section: "records"
      recordClinic: $recordClinic
      recordConsultationDate: ["and", $startDate, $endDate]
    ) {
      ... on records_records_Entry {
        id
        recordCaseCompletedDate
        recordCaseConsultedDate
        recordConsultationDate
        recordTreatmentDate
        recordCaseBookedDate
        dateUpdated
        recordAccountRevenue
        dateCreated
        recordClinic {
          ... on locations_locations_Entry {
            locationShortName
            id
          }
        }
      }
    }
  }
`;

export const newLeadCountDateRangeQuery = gql`
  query newLeadCountQuery(
    $locationInfo: [QueryArgument]
  ) # $startDate: QueryArgument
  # $endDate: QueryArgument
  {
    entries(
      locationInfo: $locationInfo
      section: "newLeadInfo"
    ) # dateEnquired: ["and", $startDate, $endDate]
    {
      ... on newLeadInfo_default_Entry {
        id
        locationInfo
        dateEnquired
        leadQuality
        websiteEnquired
        referer
      }
    }
  }
`;

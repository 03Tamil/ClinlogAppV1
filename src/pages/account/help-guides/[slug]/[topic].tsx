import HelpGuidesCategory from './index'

export async function getServerSideProps({params}) {
  return {
    props: {
      topic: params.topic,
      slug: params.slug
    },
  }
}


export default function HelpGuidesCategoryTopic({slug, topic}) {
  return (
    <HelpGuidesCategory slug={slug} topic={topic}/>
  )
}

HelpGuidesCategoryTopic.auth = {
  role: "Staff"
}
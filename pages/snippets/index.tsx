import { gql } from "@apollo/client";
import { GetStaticProps } from "next";
import React, { Fragment, useEffect, useState } from "react";
import Container from "../../components/Container";
import PageHeader from "../../components/PageHeader";
import SectionWithTitle from "../../components/SectionWithTitle";
import SnippetsList from "../../components/SnippetsList";
import client from "../../lib/apolloClient";
import { SnippetType } from "../../types";

const SnippetsPage = ({ snippets }: { snippets: SnippetType[] }) => {
  const [searchValue, setSearchValue] = useState("");
  const [searchedSnippets, setSearchedSnippets] = useState<SnippetType[]>([]);

  useEffect(() => {
    let _snippets: SnippetType[] = [];
    let searchKeywords = searchValue.split(" ");
    _snippets = snippets.filter((b) => {
      let matched = false;
      searchKeywords.forEach((key) => {
        if (b.title.toLowerCase().match(key.toLowerCase())) {
          matched = true;
          return;
        } else if (b.excerpt.toLowerCase().match(key.toLowerCase())) {
          matched = true;
          return;
        } else if (b.category.title.toLowerCase().match(key.toLowerCase())) {
          matched = true;
          return;
        }
      });
      return matched;
    });
    setSearchedSnippets(_snippets);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);

  return (
    <Fragment>
      <PageHeader
        title="Snippets"
        description="Helpful snippets. These snippets help me save lot's of time every day."
        searchValue={searchValue}
        onSearchValueChange={setSearchValue}
      />
      <main className="flex flex-col gap-16 py-16">
        {searchValue ? (
          <SectionWithTitle
            title="Results"
            trailing={`${searchedSnippets.length} Snippets`}
          >
            <SnippetsList snippets={searchedSnippets} />
          </SectionWithTitle>
        ) : (
          <Container>
            <SnippetsList snippets={snippets} />
          </Container>
        )}
      </main>
    </Fragment>
  );
};

export default SnippetsPage;

export const getStaticProps: GetStaticProps = async () => {
  const {
    data: { snippets },
  } = await client.query({
    query: gql`
      query MyQuery {
        snippets(orderBy: updatedAt_DESC) {
          slug
          title
          excerpt
          isFeatured
          updatedAt
          createdAt
          category {
            title
            slug
          }
        }
      }
    `,
  });
  return {
    props: {
      snippets,
    },
  };
};

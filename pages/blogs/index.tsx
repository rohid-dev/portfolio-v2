import { gql } from "@apollo/client";
import { GetStaticProps } from "next";
import React, { Fragment, useEffect, useState } from "react";
import PageHeader from "../../components/PageHeader";
import BlogsList from "../../components/BlogsList";
import SectionWithTitle from "../../components/SectionWithTitle";
import client from "../../lib/apolloClient";
import { BlogType } from "../../types";
import { match } from "assert";

const BlogsPage = ({
  allBlogs,
  featuredBlogs,
}: {
  allBlogs: BlogType[];
  featuredBlogs: BlogType[];
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [searchedBlogs, setSearchedBlogs] = useState<BlogType[]>([]);

  useEffect(() => {
    let _blogs: BlogType[] = [];
    let searchKeywords = searchValue.split(" ");
    _blogs = allBlogs.filter((b) => {
      let matched = false;
      searchKeywords.forEach((key) => {
        if (b.title.toLowerCase().match(key.toLowerCase())) {
          matched = true;
          return;
        } else if (b.excerpt.toLowerCase().match(key.toLowerCase())) {
          matched = true;
          return;
        }
      });
      return matched;
    });
    setSearchedBlogs(_blogs);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);

  return (
    <Fragment>
      <PageHeader
        title="Blogs"
        description="I recently started blogging. Here are some of my blogs. I am trying to blog regularly :)"
        searchValue={searchValue}
        onSearchValueChange={setSearchValue}
      />
      <main className="flex flex-col gap-16 py-16">
        {searchValue ? (
          <SectionWithTitle
            title="Results"
            trailing={`${searchedBlogs.length} Blogs`}
          >
            <BlogsList blogs={searchedBlogs} />
          </SectionWithTitle>
        ) : (
          <Fragment>
            <SectionWithTitle title="Featured Blogs">
              <BlogsList blogs={featuredBlogs} />
            </SectionWithTitle>
            <SectionWithTitle
              title="All Blogs"
              trailing={`${allBlogs.length} Blogs`}
            >
              <BlogsList blogs={allBlogs} />
            </SectionWithTitle>
          </Fragment>
        )}
      </main>
    </Fragment>
  );
};

export default BlogsPage;

export const getStaticProps: GetStaticProps = async () => {
  const {
    data: { blogs: allBlogs },
  } = await client.query({
    query: gql`
      query GetData {
        blogs(orderBy: createdAt_DESC) {
          slug
          title
          excerpt
          isFeatured
          createdAt
          updatedAt
          category {
            slug
            title
          }
        }
      }
    `,
  });
  const {
    data: { blogs: featuredBlogs },
  } = await client.query({
    query: gql`
      query GetData {
        blogs(orderBy: createdAt_DESC, first: 3, where: { isFeatured: true }) {
          slug
          title
          excerpt
          createdAt
          updatedAt
          category {
            slug
            title
          }
        }
      }
    `,
  });
  return {
    props: {
      allBlogs,
      featuredBlogs,
    },
  };
};

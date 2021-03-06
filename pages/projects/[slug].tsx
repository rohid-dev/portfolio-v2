import { gql } from "@apollo/client";
import { GetStaticPaths, GetStaticProps } from "next";
import Image from "next/image";
import React, { Fragment } from "react";
import Container from "../../components/Container";
import CustomHead from "../../components/CustomHead";
import Markdown from "../../components/Markdown";
import NewsLetterForm from "../../components/NewsLetterForm";
import client from "../../lib/apolloClient";
import { ProjectType } from "../../types";

const ProjectPage = ({ project }: { project: ProjectType }) => {
  return (
    <Fragment>
      <CustomHead
        title={project.title}
        description={project.body.slice(0, 200)}
        image={project.coverPhoto.url}
        alt={`${project.title} cover photo`}
        canonical={`https://rohidulislam.com/projects/${project.slug}`}
        keywords={project.tags}
      />
      <header className="py-8">
        <Container>
          <div className="flex flex-col items-start">
            {project.category && (
              <p className="text-lg font-medium mb-2 opacity-75">
                {project.category.title}
              </p>
            )}
            <h1 className="text-2xl sm:text-3xl font-bold">{project.title}</h1>
          </div>
        </Container>
        <Container className="mt-8 max-w-4xl">
          <div className="relative aspect-video rounded-2xl overflow-hidden w-full">
            <Image
              src={project.coverPhoto.url}
              alt="Project Cover Photo"
              layout="fill"
              className="object-cover"
            />
          </div>
        </Container>
      </header>
      <main className="flex flex-col gap-16">
        <article>
          <Container>
            {project.body && <Markdown markdown={project.body} />}
          </Container>
        </article>
        <section id="newsletter">
          <Container>
            <NewsLetterForm />
          </Container>
        </section>
      </main>
    </Fragment>
  );
};

export default ProjectPage;

export const getStaticPaths: GetStaticPaths = async () => {
  const {
    data: { projects },
  } = await client.query({
    query: gql`
      query GetData {
        projects {
          slug
        }
      }
    `,
  });

  const paths = projects.map((project) => ({
    params: {
      slug: project.slug,
    },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const {
    data: { projects },
  } = await client.query({
    query: gql`
      query GetData {
        projects(
          where: { slug: "${params.slug}" }
        ) {
          slug
          title
          body
          tags
          createdAt
          updatedAt
          tags
          category {
            slug
            title
          }
          coverPhoto {
            url
          }
        }
      }
    `,
  });

  return {
    props: {
      project: projects[0],
    },
  };
};

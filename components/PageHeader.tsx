import { SearchIcon } from "@heroicons/react/outline";
import Head from "next/head";
import React from "react";
import Container from "./Container";

const PageHeader = ({
  title,
  description,
  searchValue,
  onSearchValueChange,
  hideSearchBar,
}: {
  title: string;
  description?: string;
  searchValue?: string;
  onSearchValueChange?: (value: string) => void;
  hideSearchBar?: boolean;
}) => {
  return (
    <header className="mt-16">
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Head>
      <Container>
        <h1 className="text-4xl font-black mb-4">{title}</h1>
        <p className="opacity-75 mb-4">{description}</p>
        {!hideSearchBar && (
          <form>
            <div className="flex gap-4 relative items-center">
              <input
                className="flex-1 h-12 px-4 pl-12 rounded-xl bg-gray-200 dark:bg-gray-800 focus:ring-2 ring-0 ring-primary-500 outline-none border-none"
                placeholder="Search"
                type="text"
                value={searchValue}
                onChange={(e) => onSearchValueChange(e.target.value)}
              />
              <SearchIcon className="w-6 h-6 absolute left-4 opacity-75" />
            </div>
          </form>
        )}
      </Container>
    </header>
  );
};

export default PageHeader;

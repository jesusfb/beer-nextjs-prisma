import { GetServerSidePropsContext, GetServerSidePropsResult, PreviewData } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { getLoginSession } from '../config/auth/session';

/**
 * Represents a type definition for a function that handles server-side rendering with
 * extended capabilities.
 *
 * @template P - A generic type that represents an object with string keys and any values.
 *   It defaults to an empty object.
 * @template Q - A generic type that represents a parsed URL query object. It defaults to
 *   the `ParsedUrlQuery` type.
 * @template D - A generic type that represents preview data. It defaults to the
 *   `PreviewData` type.
 * @param context - The context object containing information about the incoming HTTP
 *   request.
 * @param session - An awaited value of the return type of the `getLoginSession` function.
 * @returns A promise that resolves to the result of the server-side rendering process.
 */
export type ExtendedGetServerSideProps<
  P extends { [key: string]: any } = { [key: string]: any },
  Q extends ParsedUrlQuery = ParsedUrlQuery,
  D extends PreviewData = PreviewData,
> = (
  context: GetServerSidePropsContext<Q, D>,
  session: Awaited<ReturnType<typeof getLoginSession>>,
) => Promise<GetServerSidePropsResult<P>>;

/**
 * A Higher Order Function that adds an authentication requirement to a Next.js
 * server-side page component.
 *
 * @param fn An async function that receives the `GetServerSidePropsContext` and
 *   authenticated session as arguments and returns a `GetServerSidePropsResult` with
 *   props for the wrapped component.
 * @returns A promise that resolves to a `GetServerSidePropsResult` object with props for
 *   the wrapped component.
 *
 *   If authentication is successful, the `GetServerSidePropsResult` will include props
 *   generated by the wrapped component's `getServerSideProps` method. If authentication
 *   fails, the `GetServerSidePropsResult` will include a redirect to the login page.
 */

const withPageAuthRequired =
  <P extends { [key: string]: any } = { [key: string]: any }>(
    fn?: ExtendedGetServerSideProps<P>,
  ) =>
  async (context: GetServerSidePropsContext) => {
    try {
      const { req } = context;
      const session = await getLoginSession(req);

      if (!fn) {
        return { props: {} };
      }

      return await fn(context, session);
    } catch (error) {
      return { redirect: { destination: '/login', permanent: false } };
    }
  };

export default withPageAuthRequired;

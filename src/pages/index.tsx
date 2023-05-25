import Head from 'next/head';
import styles from '@/styles/Home.module.scss';
import { useContext, useEffect, useState } from 'react';
import { auth, getUserData } from '@/backend/user';
import { appContext } from './_app';
import { GetServerSidePropsContext } from 'next';
import { IpageProps } from '@/interfaces';

export async function getServerSideProps ( context : GetServerSidePropsContext ) {

  const isAuth = await auth(context.req.headers.cookie);

  if ( isAuth.err ) {
    return {
      redirect : {
        permanent : false,
        destination : "/login"
      },
      props : {
        isAuth : false
      }
    }
  }

  const userdata = await getUserData( context.req.headers.cookie );

  if ( userdata.lastViewedThread ) {
    return {
      redirect : {
        permanent : false,
        destination : `/t/${userdata.lastViewedThread.toString()}`
      },
      props : {
        isAuth : true
      }
    }
  }

  return {
    redirect : {
      permanent : false,
      destination : "/t"
    },
    props : {
      isAuth : true
    }
  }

}

export default function Home( props : IpageProps ) {

  const ac = useContext(appContext);

  return (
    <>
      <Head>
        <title>{`${process.env.NEXT_PUBLIC_APP_NAME}`}</title>
        <meta name="description" content="Chatting web application" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </>
  )
}

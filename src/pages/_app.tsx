import { CreateWebsocket } from '@/backend/websocket';
import { IappContext, IgetThreadMessagesResponse, Imessage, ImessageData, ImessageSending, Ithread, IthreadComponentProps, IthreadListComponentProps } from '@/interfaces';
import Layout from '@/layouts/layout'
import { appReducer } from '@/reducers/appReducer';
import '@/styles/globals.css'
import { EappActionTypes, EwsMessageType } from '@/types';
import type { AppProps } from 'next/app'
import Head from 'next/head';
import { useRouter } from 'next/router';
import {  createContext, useEffect, useReducer, useRef } from 'react';

export const appContext = createContext<IappContext | null>(null);

export default function App({ Component, pageProps } : AppProps) {

  // Router
  const router = useRouter();

  const [ appState, appDispatch ] = useReducer( appReducer, {
    websocket : undefined,
    userdata : null,
    thread : null,
    messages : [],
    sending : [],
    sendingActive : false,
    threads : {
      list : []
    },
  });

  const messagesArrayRef = useRef<Imessage[]>([]);
  const sendingArrayRef = useRef<{ [ key : string ] : Imessage }>({});
  const appStateRef = useRef(appState);

  // Function for creating websocket
  function createWs( auth : boolean ) {

    if ( appState.websocket === undefined && auth ) {

      const ws = CreateWebsocket( {
        close : () => {
          appDispatch({
            type : EappActionTypes.SETWS,
            payload : undefined
          });
        },
        appendNewMessage : ( data ) => {
          // appDispatch({
          //   type : EappActionTypes.SETINCOMINGMESSAGE,
          //   payload : data
          // });
          messagesArrayRef.current.unshift(data);
          appDispatch({
            type : EappActionTypes.RERENDER
          });
        },
        messageConfirm : ( data ) => {
          // appDispatch({
          //   type : EappActionTypes.SETCONFIRMMESSAGE,
          //   payload : data
          // });
          if ( sendingArrayRef.current[data._id.toString()] ) {
            sendingArrayRef.current[data._id.toString()]._id = data._id;
            sendingArrayRef.current[data._id.toString()].createdAt = data.createdAt;
            sendingArrayRef.current[data._id.toString()].updatedAt = data.updatedAt;
            delete sendingArrayRef.current[data._id.toString()].to;
          }
          // sendingArrayRef.current.forEach( d => {
          //     if ( d._id.toString() === data._id.toString() ) {
          //         d._id = data._id;
          //         d.createdAt = data.createdAt;
          //         d.updatedAt = data.updatedAt;
          //         delete d.to;
          //         return;
          //     }
          // } )
          appDispatch({
            type : EappActionTypes.RERENDER
          });
        }
      } );

      // Set the websocket state
      appDispatch({
        type : EappActionTypes.SETWS,
        payload : ws
      });

      // ws.addEventListener("message", async message => {
      //   let updatedMessages = (await getMessages( appStateRef.current.thread?.threadData._id.toString() as string )).results;
      //   let updatedThreadList = await getThreadList();

      //   appDispatch({
      //     type : EappActionTypes.SETMESSAGES,
      //     payload : updatedMessages
      //   });
      //   appDispatch({
      //     type : EappActionTypes.SETTHREADLIST,
      //     payload : updatedThreadList
      //   })
        
      // })
    };
  }

  // Function for closing websocket
  function closeWs() {
    if ( appState.websocket !== undefined ) {
      appState.websocket.close();
    }
  }

  // Function for setting thread data
  function setThread( data : Ithread | null ) {
    appDispatch({
      type : EappActionTypes.SETTHREAD,
      payload : data
    });
  }

  // Function for getting thread data
  function getThread() {
    return appState.thread;
  }

  function getRoute() : string {
    return router.pathname;
  }

  // Set thread list
  function setThreadList( data : IthreadListComponentProps | null ) {
    appDispatch({
      type : EappActionTypes.SETTHREADLIST,
      payload : data
    });
  }

  // Set thread messages
  function setMessages( _messages : Imessage[] ) {
    
    // appDispatch({
    //   type : EappActionTypes.SETMESSAGES,
    //   payload : _messages
    // });

    messagesArrayRef.current = _messages;
    appDispatch({
      type : EappActionTypes.RERENDER
    });

  }

  // Append new message data to the sending queue
  function newMessage( _data : ImessageSending ) {

    // appDispatch({
    //   type : EappActionTypes.SETNEWMESSAGE,
    //   payload : _data
    // })
    // if ( appState.sendingActive === false ) {
    //   appDispatch({
    //     type : EappActionTypes.SEND
    //   });
    // }

    messagesArrayRef.current.unshift(_data);
    sendingArrayRef.current[_data._id.toString()] = _data;
    appState.websocket?.send(JSON.stringify({
      type : EwsMessageType.MESSAGE_SEND,
      payload : {
          id : _data._id,
          message : _data.message,
          threadId : _data.thread,
          to : _data.to
      }
  }));
    appDispatch({
      type : EappActionTypes.RERENDER
    });
  }

  useEffect(() => {
    appStateRef.current = appState;
  }, [appState]);

  useEffect(() => {

    // if ( appState.sendingActive === false ) {
    //   appDispatch({
    //     type : EappActionTypes.SEND
    //   });
    // }
    
  }, [ appState.sending, appState.sendingActive ]);

  return (
    <appContext.Provider value={{
      state : appStateRef,
      messagesArray : messagesArrayRef,
      ws : {
        set : createWs,
        get : () => appState.websocket,
        close : closeWs
      },
      thread : {
        set : setThread,
        get : () => appState.thread,
      },
      messages : {
        set : setMessages,
        get : () => messagesArrayRef.current,
        new : newMessage
      },
      threadlist : {
        set : setThreadList,
        get : () : IthreadListComponentProps | null => appState.threads
      },
      getRoute : getRoute
    }}>
      <Head>
        <title>{`${process.env.NEXT_PUBLIC_APP_NAME}`}</title>
      </Head>
      {
        ["/signup", "/login"].some( s => router.pathname.includes(s) ) || router.pathname === "/" ?
          <Component {...pageProps} />
          :
          <Layout>
              <Component {...pageProps} />
          </Layout>
      }
    </appContext.Provider>
    )
}

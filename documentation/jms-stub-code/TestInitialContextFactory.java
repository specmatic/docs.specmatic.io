package com.jfs.digitalapi.inventory.dmposting;

import org.apache.activemq.ActiveMQConnectionFactory;

import javax.jms.*;
import javax.naming.*;
import javax.naming.spi.InitialContextFactory;
import java.io.Serializable;
import java.util.Hashtable;

public class TestInitialContextFactory implements InitialContextFactory {
    static ActiveMQConnectionFactory factory = new ActiveMQConnectionFactory("tcp://localhost:61616");

    @Override
    public Context getInitialContext(Hashtable<?, ?> environment) throws NamingException {
        return new Context() {
            @Override
            public Object lookup(Name name) throws NamingException {
                return null;
            }

            @Override
            public Object lookup(String name) throws NamingException {
                if (name.equals("QueueConnectionFactory")) {
                    return factory;
                }
                return null;
            }

            @Override
            public void bind(Name name, Object obj) throws NamingException {

            }

            @Override
            public void bind(String name, Object obj) throws NamingException {

            }

            @Override
            public void rebind(Name name, Object obj) throws NamingException {

            }

            @Override
            public void rebind(String name, Object obj) throws NamingException {

            }

            @Override
            public void unbind(Name name) throws NamingException {

            }

            @Override
            public void unbind(String name) throws NamingException {

            }

            @Override
            public void rename(Name oldName, Name newName) throws NamingException {

            }

            @Override
            public void rename(String oldName, String newName) throws NamingException {

            }

            @Override
            public NamingEnumeration<NameClassPair> list(Name name) throws NamingException {
                return null;
            }

            @Override
            public NamingEnumeration<NameClassPair> list(String name) throws NamingException {
                return null;
            }

            @Override
            public NamingEnumeration<Binding> listBindings(Name name) throws NamingException {
                return null;
            }

            @Override
            public NamingEnumeration<Binding> listBindings(String name) throws NamingException {
                return null;
            }

            @Override
            public void destroySubcontext(Name name) throws NamingException {

            }

            @Override
            public void destroySubcontext(String name) throws NamingException {

            }

            @Override
            public Context createSubcontext(Name name) throws NamingException {
                return null;
            }

            @Override
            public Context createSubcontext(String name) throws NamingException {
                return null;
            }

            @Override
            public Object lookupLink(Name name) throws NamingException {
                return null;
            }

            @Override
            public Object lookupLink(String name) throws NamingException {
                return null;
            }

            @Override
            public NameParser getNameParser(Name name) throws NamingException {
                return null;
            }

            @Override
            public NameParser getNameParser(String name) throws NamingException {
                return null;
            }

            @Override
            public Name composeName(Name name, Name prefix) throws NamingException {
                return null;
            }

            @Override
            public String composeName(String name, String prefix) throws NamingException {
                return null;
            }

            @Override
            public Object addToEnvironment(String propName, Object propVal) throws NamingException {
                return null;
            }

            @Override
            public Object removeFromEnvironment(String propName) throws NamingException {
                return null;
            }

            @Override
            public Hashtable<?, ?> getEnvironment() throws NamingException {
                return null;
            }

            @Override
            public void close() throws NamingException {

            }

            @Override
            public String getNameInNamespace() throws NamingException {
                return null;
            }
        };
    }
}

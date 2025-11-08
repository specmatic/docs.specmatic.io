package jms;

import org.apache.activemq.ActiveMQConnectionFactory;

import javax.jms.*;
import javax.naming.*;
import javax.naming.spi.InitialContextFactory;
import java.util.Hashtable;

public class TestInitialContextFactory implements InitialContextFactory {
    private static final ActiveMQConnectionFactory factory = new ActiveMQConnectionFactory("tcp://localhost:61616");

    @Override
    public Context getInitialContext(Hashtable<?, ?> environment) throws NamingException {
        return new Context() {
            @Override
            public Object lookup(Name name) {
                return null;
            }

            @Override
            public Object lookup(String name) {
                if (name.equals("QueueConnectionFactory")) {
                    return factory;
                }
                return null;
            }

            @Override
            public void bind(Name name, Object obj) {

            }

            @Override
            public void bind(String name, Object obj) {

            }

            @Override
            public void rebind(Name name, Object obj) {

            }

            @Override
            public void rebind(String name, Object obj) {

            }

            @Override
            public void unbind(Name name) {

            }

            @Override
            public void unbind(String name) {

            }

            @Override
            public void rename(Name oldName, Name newName) {

            }

            @Override
            public void rename(String oldName, String newName) {

            }

            @Override
            public NamingEnumeration<NameClassPair> list(Name name) {
                return null;
            }

            @Override
            public NamingEnumeration<NameClassPair> list(String name) {
                return null;
            }

            @Override
            public NamingEnumeration<Binding> listBindings(Name name) {
                return null;
            }

            @Override
            public NamingEnumeration<Binding> listBindings(String name) {
                return null;
            }

            @Override
            public void destroySubcontext(Name name) {

            }

            @Override
            public void destroySubcontext(String name) {

            }

            @Override
            public Context createSubcontext(Name name) {
                return null;
            }

            @Override
            public Context createSubcontext(String name) {
                return null;
            }

            @Override
            public Object lookupLink(Name name) {
                return null;
            }

            @Override
            public Object lookupLink(String name) {
                return null;
            }

            @Override
            public NameParser getNameParser(Name name) {
                return null;
            }

            @Override
            public NameParser getNameParser(String name) {
                return null;
            }

            @Override
            public Name composeName(Name name, Name prefix) {
                return null;
            }

            @Override
            public String composeName(String name, String prefix) {
                return null;
            }

            @Override
            public Object addToEnvironment(String propName, Object propVal) {
                return null;
            }

            @Override
            public Object removeFromEnvironment(String propName) {
                return null;
            }

            @Override
            public Hashtable<?, ?> getEnvironment() {
                return null;
            }

            @Override
            public void close() {

            }

            @Override
            public String getNameInNamespace() {
                return null;
            }
        };
    }
}

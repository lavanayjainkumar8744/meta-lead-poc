import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, StatusBar } from 'react-native';
import { io } from 'socket.io-client';

const BACKEND_URL = 'https://crested-haunt-unveiling.ngrok-free.dev';

export default function App() {
  const [leads, setLeads] = useState([]);
  const [status, setStatus] = useState('Connecting...');

  useEffect(() => {
    const socket = io(BACKEND_URL, {
      transports: ['websocket'],
      extraHeaders: {
        'ngrok-skip-browser-warning': 'true',
      },
    });

    socket.on('connect', () => {
      console.log('Socket connected');
      setStatus('Connected');
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
      setStatus('Disconnected');
    });

    socket.on('lead_received', (newLead) => {
      console.log('New lead event:', newLead);
      setLeads((current) => [newLead, ...current]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const renderLeadCard = ({ item, index }) => {
    const lead = item.value || {};
    const formattedTime = lead.created_time
      ? new Date(lead.created_time * 1000).toLocaleTimeString()
      : new Date().toLocaleTimeString();

    return (
      <View style={styles.leadCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.badgeText}>Lead #{leads.length - index}</Text>
          <Text style={styles.timeText}>{formattedTime}</Text>
        </View>

        <View style={styles.cardRow}>
          <Text style={styles.label}>Lead ID:</Text>
          <Text style={styles.value}>{lead.leadgen_id || lead.ad_id || 'Test Lead'}</Text>
        </View>

        <View style={styles.cardRow}>
          <Text style={styles.label}>Form ID:</Text>
          <Text style={styles.value}>{lead.form_id || 'N/A'}</Text>
        </View>

        <View style={styles.cardRow}>
          <Text style={styles.label}>Page ID:</Text>
          <Text style={styles.value}>{lead.page_id || 'N/A'}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <Text style={styles.title}>Meta Lead Ads Live</Text>
        <View style={styles.statusRow}>
          <View
            style={[
              styles.statusDot,
              { backgroundColor: status === 'Connected' ? '#2e7d32' : '#d32f2f' },
            ]}
          />
          <Text style={styles.statusLabel}>{status}</Text>
        </View>
      </View>

      <View style={styles.contentContainer}>
        {leads.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No leads received yet</Text>
            <Text style={styles.emptySubtitle}>
              Submit a lead from Meta's Lead Testing Tool. It will appear here automatically without refreshing.
            </Text>
          </View>
        ) : (
          <FlatList
            data={leads}
            renderItem={renderLeadCard}
            keyExtractor={(_, idx) => idx.toString()}
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f5f6f8',
  },
  header: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusLabel: {
    fontSize: 13,
    color: '#666666',
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#777777',
    textAlign: 'center',
    lineHeight: 20,
  },
  listContent: {
    paddingBottom: 20,
  },
  leadCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e8e8e8',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  badgeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1976d2',
  },
  timeText: {
    fontSize: 12,
    color: '#888888',
  },
  cardRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  label: {
    width: 80,
    fontSize: 13,
    color: '#666666',
    fontWeight: '500',
  },
  value: {
    flex: 1,
    fontSize: 13,
    color: '#222222',
  },
});
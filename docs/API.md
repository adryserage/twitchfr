# API Documentation

## Authentication

### Twitch OAuth

```typescript
POST / api / auth / twitch;
```

Initiates Twitch OAuth flow

### Refresh Token

```typescript
POST / api / auth / refresh;
```

Refreshes authentication token

## Streams

### Get Featured Streams

```typescript
GET / api / streams / featured;
```

Returns featured French streams

### Get Stream Details

```typescript
GET /api/streams/:id
```

Returns detailed information about a specific stream

## Community

### Get Top Streamers

```typescript
GET / api / community / top;
```

Returns top French streamers

### Search Streamers

```typescript
GET / api / community / search;
```

Search for French streamers

## Analytics

### Get Stream Stats

```typescript
GET /api/analytics/stream/:id
```

Returns analytics for a specific stream

## Error Responses

All endpoints follow standard HTTP status codes:

- 200: Success
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error

## Rate Limiting

- 100 requests per minute per IP
- 1000 requests per hour per user

## Data Models

[To be documented based on implementation]

## WebSocket Events

[To be documented based on implementation]

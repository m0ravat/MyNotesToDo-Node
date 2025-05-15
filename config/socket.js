function setupSockets(io) {
  io.on('connection', (socket) => {
    socket.on('joinProject', (projectId) => {
      socket.join(projectId);
      console.log(`Socket joined project ${projectId}`);
    });

    socket.on('addedToProject', ({ projectId, user }) => {
      socket.join(projectId);
      console.log(`User ${user.username} added to project ${projectId}`);
      socket.to(projectId).emit('addToProject', { user });
    });

    socket.on('projectUpdated', ({ projectId, ...data }) => {
      socket.to(projectId).emit('projectUpdated', data);
    });

    socket.on('projectDeleted', ({ projectId, ...data }) => {
      socket.to(projectId).emit('projectDeleted', data);
    });

    socket.on('cardAdded', ({ projectId, card }) => {
      socket.to(projectId).emit('cardAdded', { card });
    });

    socket.on('cardUpdated', ({ projectId, card }) => {
      socket.to(projectId).emit('cardUpdated', { card });
    });

    socket.on('cardDeleted', ({ projectId, cardId }) => {
      socket.to(projectId).emit('cardDeleted', { cardId });
    });

    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });
  });
}

module.exports = setupSockets;

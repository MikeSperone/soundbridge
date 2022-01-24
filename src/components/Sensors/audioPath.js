var audioPath = 'audio';
if (process.env.NODE_ENV === 'development') audioPath = '/' + audioPath;

export default audioPath;

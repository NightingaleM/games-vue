const stepAction = (start, end, duration, ctx, option) => {
  let {lineWidth, strokeStyle} = option
  let [startX, startY] = start;
  let [endX, endY] = end;
  duration = duration ? duration : 1000;
  let [prevX, prevY] = [startX, startY];
  let nextX;
  let nextY;
  let startTime;
  const step = (currentTime) => {
    // 记录第一帧的绘制时间
    !startTime && (startTime = currentTime);
    // 已过去的时间
    const elapsed = currentTime - startTime;
    // 执行百分比
    const progress = Math.min(elapsed / duration, 1);

    const draw = () => {
      ctx.beginPath();
      ctx.moveTo(prevX, prevY);
      prevX = nextX = startX + (endX - startX) * progress;
      prevY = nextY = startY + (endY - startY) * progress;
      ctx.lineTo(nextX, nextY);
      ctx.lineWidth = lineWidth ? lineWidth : 2
      ctx.strokeStyle = strokeStyle ? strokeStyle : 'rgba(81, 160, 255,1)';
      ctx.stroke();
    };
    draw();
    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
    }
  };
  requestAnimationFrame(step);
};

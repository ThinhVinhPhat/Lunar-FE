import { useCountdown } from "@/shared/hooks/useCountDown";

interface Props {
  expireAt: Date | string;
}

export const CountdownTimer = ({ expireAt }: Props) => {
  const timeLeft = useCountdown(expireAt);

  if (!timeLeft)
    return <span className="text-red-500 text-xs">Đã hết hạn</span>;

  const { days, hours, minutes } = timeLeft;

  return (
    <span className="text-xs text-gray-500">
      {days > 0 && `${days} ngày `}
      {hours > 0 && `${hours} giờ `}
      {minutes > 0 && `${minutes} phút`}
    </span>
  );
};

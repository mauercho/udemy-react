import { useParams } from "react-router-dom";

function EventDetailpage() {
  const params = useParams();
  return (
    <>
      <h1>EventDetailPage</h1>
      <p>Event ID: {params.eventId}</p>
    </>
  );
}

export default EventDetailpage;

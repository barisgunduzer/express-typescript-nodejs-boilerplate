import { User } from '@api/entities/User';
import { EntitySubscriberInterface, EventSubscriber, InsertEvent, SoftRemoveEvent } from 'typeorm';
import { WelcomeMailQueueJob } from '@api/jobs/queue/mail/WelcomeMailQueueJob';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  listenTo() {
    return User;
  }

  afterInsert(event: InsertEvent<User>) {
    new WelcomeMailQueueJob(event.entity)
      .setOptions({ delay: 5000 })
      .dispatch()
      .then(() => {
        console.log(`event: User created (${event.entity.userName}) welcome mail sent to ${event.entity.email}`);
      });
  }

  afterSoftRemove(event: SoftRemoveEvent<any>) {
    console.log(`event: User removed (${event.entity.userName})`, event.entity);
  }
}

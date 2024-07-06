import { MomentUnitTypeEnum } from '@api/enums/MomentUnitTypeEnum';
import moment from 'moment';

export function getStartAndEndDates(date: Date, type: MomentUnitTypeEnum = MomentUnitTypeEnum.day) {
  return {
    startDate: moment(date).startOf(type).toDate(),
    endDate: moment(date).endOf(type).toDate(),
  };
}

export function diffSecondTimes(bigDate: Date, littleDate: Date) {
  const bigDateMoment = moment(bigDate);
  const littleMoment = moment(littleDate);
  return bigDateMoment.diff(littleMoment, 'seconds');
}

export function addSecondToMoment(expireIn: number): Date {
  return moment().add(expireIn, 'seconds').toDate();
}

export function getNow() {
  return moment().toDate();
}

export function convertToYmd(value: Date) {
  return moment(value).format('YYYY-MM-DD');
}

export function convertToDmy(value: Date) {
  return moment(value).format('DD/MM/YYYY');
}

export function convertToYmdHms(value: Date) {
  return convertDateToFormat(value, 'YYYY-MM-DD HH:mm:ss');
}

export function convertDateToFormat(value: Date, format: string) {
  try {
    return moment(value).format(format);
  } catch (e) {
    return null;
  }
}

import { Injectable } from '@nestjs/common';
import { CreateEtlDto } from './dto/create-etl.dto';
import { UpdateEtlDto } from './dto/update-etl.dto';

@Injectable()
export class EtlService {
  create(createEtlDto: CreateEtlDto) {
    return 'This action adds a new etl';
  }

  findAll() {
    return `This action returns all etl`;
  }

  findOne(id: number) {
    return `This action returns a #${id} etl`;
  }

  update(id: number, updateEtlDto: UpdateEtlDto) {
    return `This action updates a #${id} etl`;
  }

  remove(id: number) {
    return `This action removes a #${id} etl`;
  }
}

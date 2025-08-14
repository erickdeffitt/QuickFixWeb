import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecconComponent } from './reccon.component';

describe('RecconComponent', () => {
  let component: RecconComponent;
  let fixture: ComponentFixture<RecconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RecconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

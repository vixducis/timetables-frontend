import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoritesDayComponent } from './favorites-day.component';

describe('FavoritesDayComponent', () => {
  let component: FavoritesDayComponent;
  let fixture: ComponentFixture<FavoritesDayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FavoritesDayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FavoritesDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

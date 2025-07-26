import { SettingsDropdown } from './SettingsDropdown';
import { User } from '../types/chat';

interface HeaderProps {
  currentUser: User;
  onUserChange: (name: string) => void;
}

export function Header({ currentUser, onUserChange }: HeaderProps) {

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between transition-colors duration-200">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center">
          <img src="/logo.png" alt="SealTalk" className="w-8 h-8 rounded-lg" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
            sealtalk
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            everyone welcome
          </p>
        </div>
      </div>

      <SettingsDropdown 
        currentUser={currentUser}
        onUserChange={onUserChange}
      />
    </header>
  );
}